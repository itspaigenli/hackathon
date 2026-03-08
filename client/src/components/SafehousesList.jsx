function SafehousesList({
  safehouses,
  onSelectSafehouse,
  selectedSafehouseId,
}) {
  if (safehouses.length === 0) {
    return <p className="empty-message">No safehouses found.</p>;
  }

  return (
    <div className="grid">
      {safehouses.map((safehouse) => {
        const isSelected = Number(selectedSafehouseId) === Number(safehouse.id);

        return (
          <button
            key={safehouse.id}
            type="button"
            className={`item-card safehouse-card ${isSelected ? "selected-card" : ""}`}
            onClick={() => onSelectSafehouse(safehouse)}
          >
            <h3>{safehouse.name}</h3>

            <p>
              <strong>ID:</strong> {safehouse.id}
            </p>

            <p>
              <strong>Location:</strong> {safehouse.location}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default SafehousesList;
