import { useState } from "react";

function AddSurvivorForm({ safehouses, onAdd }) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    age: "",
    skill: "",
    health_status: "",
    safehouse_id: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await onAdd({
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      age: Number(formData.age),
      skill: formData.skill.trim(),
      health_status: formData.health_status.trim(),
      safehouse_id: Number(formData.safehouse_id),
    });

    setFormData({
      firstname: "",
      lastname: "",
      age: "",
      skill: "",
      health_status: "",
      safehouse_id: "",
    });
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstname"
        placeholder="First name"
        value={formData.firstname}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="lastname"
        placeholder="Last name"
        value={formData.lastname}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        min="0"
        required
      />

      <input
        type="text"
        name="skill"
        placeholder="Skill"
        value={formData.skill}
        onChange={handleChange}
      />

      <input
        type="text"
        name="health_status"
        placeholder="Health status"
        value={formData.health_status}
        onChange={handleChange}
      />

      <select
        name="safehouse_id"
        value={formData.safehouse_id}
        onChange={handleChange}
        required
      >
        <option value="">Select a safehouse</option>
        {safehouses.map((safehouse) => (
          <option key={safehouse.id} value={safehouse.id}>
            {safehouse.name}
          </option>
        ))}
      </select>

      <button type="submit">Add Survivor</button>
    </form>
  );
}

export default AddSurvivorForm;
