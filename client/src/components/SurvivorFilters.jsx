import { useMemo, useState } from "react";

function SurvivorFilters({
  filters,
  onApplyFilters,
  onClearFilters,
  safehouses,
  survivors,
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  const healthOptions = useMemo(() => {
    const values = survivors
      .map((survivor) => survivor.health_status)
      .filter(Boolean);

    return [...new Set(values)].sort();
  }, [survivors]);

  const skillOptions = useMemo(() => {
    const values = survivors.map((survivor) => survivor.skill).filter(Boolean);

    return [...new Set(values)].sort();
  }, [survivors]);

  function handleChange(event) {
    const { name, value } = event.target;

    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onApplyFilters(localFilters);
  }

  function handleClear() {
    const cleared = {
      health_status: "",
      skill: "",
      safehouse_id: "",
    };

    setLocalFilters(cleared);
    onClearFilters();
  }

  return (
    <form className="filter-row" onSubmit={handleSubmit}>
      <select
        name="health_status"
        value={localFilters.health_status}
        onChange={handleChange}
      >
        <option value="">All health statuses</option>
        {healthOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <select name="skill" value={localFilters.skill} onChange={handleChange}>
        <option value="">All skills</option>
        {skillOptions.map((skill) => (
          <option key={skill} value={skill}>
            {skill}
          </option>
        ))}
      </select>

      <select
        name="safehouse_id"
        value={localFilters.safehouse_id}
        onChange={handleChange}
      >
        <option value="">All safehouses</option>
        {safehouses.map((safehouse) => (
          <option key={safehouse.id} value={safehouse.id}>
            {safehouse.name}
          </option>
        ))}
      </select>

      <button className="action-button" type="submit">
        Apply Filters
      </button>

      <button className="clear-button" type="button" onClick={handleClear}>
        Clear Filters
      </button>
    </form>
  );
}

export default SurvivorFilters;
