function SafehousesList({ safehouses }) {
  if (safehouses.length === 0) {
    return <p className="empty-message">No safehouses found.</p>;
  }

  return (
    <div className="grid">
      {safehouses.map((safehouse) => (
        <div key={safehouse.id} className="item-card">
          <h3>{safehouse.name}</h3>
          <p>
            <strong>ID:</strong> {safehouse.id}
          </p>
          <p>
            <strong>Location:</strong> {safehouse.location}
          </p>
        </div>
      ))}
    </div>
  );
}

export default SafehousesList;
