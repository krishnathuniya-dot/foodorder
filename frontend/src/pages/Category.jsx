import React, { useState } from "react";
import "../css/category.css";

export default function Category() {
  const [formData, setFormData] = useState({
    category: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category.trim()) {
      alert("Please enter category name");
      return;
    }

    try {
      const res = await fetch("https://foodorder-lafi.onrender.com/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
 setFormData({ category: "" });

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        alert(data.message || "Failed to create category");
      }
    } catch (err) {
      console.error("Frontend Error:", err);
      alert("Error creating category.");
    }
  };

  return (
    <div className="containerg">
      <h2>Create Category</h2>

      {success && (
        <div className="successg">
          SUCCESS: Category Created successfully
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-groupg">
          <label>Category Name</label>
          <input
            type="text"
            name="category"
            className="inputg"
            placeholder="Enter category Name"
            onChange={handleChange}
            value={formData.category}
            required
          />
        </div>

        <button type="submit" className="buttong">
          Submit
        </button>
      </form>
    </div>
  );
}