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
      skill: formData.skill,
      health_status: formData.health_status,
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

      <select
        name="skill"
        value={formData.skill}
        onChange={handleChange}
        required
      >
        <option value="">Select skill</option>
        <option value="medic">medic</option>
        <option value="scout">scout</option>
        <option value="engineer">engineer</option>
        <option value="fighter">fighter</option>
        <option value="hunter">hunter</option>
      </select>

      <select
        name="health_status"
        value={formData.health_status}
        onChange={handleChange}
        required
      >
        <option value="">Select health status</option>
        <option value="healthy">healthy</option>
        <option value="injured">injured</option>
        <option value="infected">infected</option>
      </select>

      <select
        name="safehouse_id"
        value={formData.safehouse_id}
        onChange={handleChange}
        required
      >
        <option value="">Select safehouse</option>
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
