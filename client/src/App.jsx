import { useEffect, useState } from "react";
import {
  getHello,
  getSafehouses,
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
  const [supplies, setSupplies] = useState([]);
  const [filters, setFilters] = useState({
    health_status: "",
    skill: "",
    safehouse_id: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadSurvivors(filters);
  }, [filters]);

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

  async function handleAddSurvivor(newSurvivor) {
    try {
      setError("");
      await createSurvivor(newSurvivor);
      await loadSurvivors(filters);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteSurvivor(id) {
    try {
      setError("");
      await deleteSurvivor(id);
      await loadSurvivors(filters);
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
        <h2>Add Survivor</h2>
        <AddSurvivorForm safehouses={safehouses} onAdd={handleAddSurvivor} />
      </section>

      <section className="section-card">
        <h2>Filter Survivors</h2>
        <SurvivorFilters
          filters={filters}
          setFilters={setFilters}
          safehouses={safehouses}
        />
      </section>

      <section className="section-card">
        <h2>Safehouses</h2>
        <SafehousesList safehouses={safehouses} />
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
