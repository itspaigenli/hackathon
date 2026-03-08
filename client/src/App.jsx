import { useEffect, useState } from "react";
import {
  getHello,
  getSafehouses,
  getSafehouseSurvivors,
  getSafehouseSupplies,
  getSurvivors,
  createSurvivor,
  deleteSurvivor,
  getSupplies,
  deleteSupply,
} from "./api";
import AddSurvivorForm from "./components/AddSurvivorForm";
import SafehousesList from "./components/SafehousesList";
import SuppliesList from "./components/SuppliesList";
import SurvivorFilters from "./components/SurvivorFilters";
import SurvivorsList from "./components/SurvivorsList";

function App() {
  const [helloMessage, setHelloMessage] = useState("");
  const [safehouses, setSafehouses] = useState([]);
  const [survivors, setSurvivors] = useState([]);
  const [allSurvivors, setAllSurvivors] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [filters, setFilters] = useState({
    health_status: "",
    skill: "",
    safehouse_id: "",
  });
  const [error, setError] = useState("");

  const [selectedSafehouse, setSelectedSafehouse] = useState(null);
  const [selectedSafehouseSurvivors, setSelectedSafehouseSurvivors] = useState(
    [],
  );
  const [selectedSafehouseSupplies, setSelectedSafehouseSupplies] = useState(
    [],
  );

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setError("");

      const [helloData, safehousesData, survivorsData, suppliesData] =
        await Promise.all([
          getHello(),
          getSafehouses(),
          getSurvivors(),
          getSupplies(),
        ]);

      setHelloMessage(helloData.message);
      setSafehouses(safehousesData);
      setSurvivors(survivorsData);
      setAllSurvivors(survivorsData);
      setSupplies(suppliesData);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadSurvivors(currentFilters = {}) {
    try {
      setError("");
      const survivorsData = await getSurvivors(currentFilters);
      setSurvivors(survivorsData);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleApplyFilters(newFilters) {
    setFilters(newFilters);
    await loadSurvivors(newFilters);
  }

  async function handleClearFilters() {
    const cleared = {
      health_status: "",
      skill: "",
      safehouse_id: "",
    };

    setFilters(cleared);
    await loadSurvivors(cleared);
  }

  async function handleAddSurvivor(newSurvivor) {
    try {
      setError("");
      await createSurvivor(newSurvivor);

      const refreshedSurvivors = await getSurvivors();
      setAllSurvivors(refreshedSurvivors);

      await loadSurvivors(filters);

      if (
        selectedSafehouse &&
        Number(selectedSafehouse.id) === Number(newSurvivor.safehouse_id)
      ) {
        await handleSelectSafehouse(selectedSafehouse);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteSurvivor(id) {
    try {
      setError("");
      await deleteSurvivor(id);

      const refreshedSurvivors = await getSurvivors();
      setAllSurvivors(refreshedSurvivors);

      await loadSurvivors(filters);

      if (selectedSafehouse) {
        await handleSelectSafehouse(selectedSafehouse);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteSupply(id) {
    try {
      setError("");
      await deleteSupply(id);

      const updatedSupplies = await getSupplies();
      setSupplies(updatedSupplies);

      if (selectedSafehouse) {
        await handleSelectSafehouse(selectedSafehouse);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSelectSafehouse(safehouse) {
    try {
      setError("");
      setSelectedSafehouse(safehouse);

      const [survivorsData, suppliesData] = await Promise.all([
        getSafehouseSurvivors(safehouse.id),
        getSafehouseSupplies(safehouse.id),
      ]);

      setSelectedSafehouseSurvivors(survivorsData.survivors);
      setSelectedSafehouseSupplies(suppliesData);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Zombie Survival Dashboard</h1>
        <p>{helloMessage}</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <section className="section-card">
        <h2>Safehouses</h2>
        <SafehousesList
          safehouses={safehouses}
          onSelectSafehouse={handleSelectSafehouse}
          selectedSafehouseId={selectedSafehouse?.id}
        />
      </section>

      {selectedSafehouse && (
        <section className="section-card">
          <h2>{selectedSafehouse.name} Details</h2>
          <p>
            <strong>Location:</strong> {selectedSafehouse.location}
          </p>

          <h3>Survivors in this Safehouse</h3>
          {selectedSafehouseSurvivors.length === 0 ? (
            <p className="empty-message">No survivors in this safehouse.</p>
          ) : (
            <div className="grid">
              {selectedSafehouseSurvivors.map((survivor) => (
                <div key={survivor.id} className="item-card">
                  <h3>
                    {survivor.firstname} {survivor.lastname}
                  </h3>
                  <p>
                    <strong>Age:</strong> {survivor.age}
                  </p>
                  <p>
                    <strong>Skill:</strong> {survivor.skill || "Unknown"}
                  </p>
                  <p>
                    <strong>Health:</strong>{" "}
                    {survivor.health_status || "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          )}

          <h3 style={{ marginTop: "24px" }}>Supplies in this Safehouse</h3>
          {selectedSafehouseSupplies.length === 0 ? (
            <p className="empty-message">No supplies in this safehouse.</p>
          ) : (
            <div className="grid">
              {selectedSafehouseSupplies.map((supply) => (
                <div key={supply.id} className="item-card">
                  <h3>{supply.name}</h3>
                  <p>
                    <strong>Category:</strong> {supply.category}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {supply.quantity}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="section-card">
        <h2>Filter Survivors</h2>
        <SurvivorFilters
          filters={filters}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          safehouses={safehouses}
          survivors={allSurvivors}
        />
      </section>

      <section className="section-card">
        <h2>Add Survivor</h2>
        <AddSurvivorForm safehouses={safehouses} onAdd={handleAddSurvivor} />
      </section>

      <section className="section-card">
        <h2>Survivors</h2>
        <SurvivorsList survivors={survivors} onDelete={handleDeleteSurvivor} />
      </section>

      <section className="section-card">
        <h2>Supplies</h2>
        <SuppliesList supplies={supplies} onDelete={handleDeleteSupply} />
      </section>
    </div>
  );
}

export default App;
