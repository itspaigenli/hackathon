import { useState } from "react";

function AddSupplyForm({ safehouses, onAddSupply }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
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

    await onAddSupply({
      name: formData.name.trim(),
      category: formData.category.trim().toLowerCase(),
      quantity: Number(formData.quantity),
      safehouse_id: Number(formData.safehouse_id),
    });

    setFormData({
      name: "",
      category: "",
      quantity: "",
      safehouse_id: "",
    });
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Supply name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
        min="0"
        max="100"
        required
      />

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

      <button type="submit">Add Supply</button>
    </form>
  );
}

export default AddSupplyForm;
