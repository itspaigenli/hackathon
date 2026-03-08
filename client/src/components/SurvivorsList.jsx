function SurvivorsList({ survivors, onDelete }) {
  if (survivors.length === 0) {
    return <p className="empty-message">No survivors found.</p>;
  }

  return (
    <div className="grid">
      {survivors.map((survivor) => (
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
            <strong>Health:</strong> {survivor.health_status || "Unknown"}
          </p>
          <p>
            <strong>Safehouse ID:</strong> {survivor.safehouse_id}
          </p>
          <button
            className="delete-button"
            onClick={() => onDelete(survivor.id)}
          >
            Delete Survivor
          </button>
        </div>
      ))}
    </div>
  );
}

export default SurvivorsList;
