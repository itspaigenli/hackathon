function SurvivorFilters({ filters, setFilters, safehouses }) {
  function handleChange(event) {
    const { name, value } = event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleClear() {
    setFilters({
      health_status: "",
      skill: "",
      safehouse_id: "",
    });
  }

  return (
    <div className="filter-row">
      <input
        type="text"
        name="health_status"
        placeholder="Filter by health status"
        value={filters.health_status}
        onChange={handleChange}
      />

      <input
        type="text"
        name="skill"
        placeholder="Filter by skill"
        value={filters.skill}
        onChange={handleChange}
      />

      <select
        name="safehouse_id"
        value={filters.safehouse_id}
        onChange={handleChange}
      >
        <option value="">All safehouses</option>
        {safehouses.map((safehouse) => (
          <option key={safehouse.id} value={safehouse.id}>
            {safehouse.name}
          </option>
        ))}
      </select>

      <button className="clear-button" type="button" onClick={handleClear}>
        Clear Filters
      </button>
    </div>
  );
}

export default SurvivorFilters;
