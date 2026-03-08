function SuppliesList({ supplies, onDelete }) {
  if (supplies.length === 0) {
    return <p className="empty-message">No supplies found.</p>;
  }

  return (
    <div className="grid">
      {supplies.map((supply) => (
        <div key={supply.id} className="item-card">
          <h3>{supply.name}</h3>
          <p>
            <strong>Category:</strong> {supply.category}
          </p>
          <p>
            <strong>Quantity:</strong> {supply.quantity}
          </p>
          <p>
            <strong>Safehouse:</strong> {supply.safehouse}
          </p>
          <p>
            <strong>Location:</strong> {supply.location}
          </p>
          <button className="delete-button" onClick={() => onDelete(supply.id)}>
            Delete Supply
          </button>
        </div>
      ))}
    </div>
  );
}

export default SuppliesList;
