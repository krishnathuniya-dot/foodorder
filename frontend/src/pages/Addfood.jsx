import React, { useState, useEffect } from "react";
import "../css/addfood.css";

export default function AddFood() {
  const [formData, setFormData] = useState({
    foodcategory: "",
    itemname: "",
    description: "",
    quantity: "",
    price: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({
      foodcategory: "",
      itemname: "",
      description: "",
      quantity: "",
      price: "",
    });

    setImage(null);
    document.querySelector('input[type="file"]').value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append("foodcategory", formData.foodcategory);
      submitData.append("itemname", formData.itemname);
      submitData.append("description", formData.description);
      submitData.append("quantity", formData.quantity);
      submitData.append("price", formData.price);

      if (image) {
        submitData.append("image1", image);
      }

      const res = await fetch("http://localhost:2340/api/addfood", {
        method: "POST",
        body: submitData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Food added successfully!");
        resetForm();
      } else {
        alert(data.message || "Failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch("http://localhost:2340/api/categorydata");
      const data = await res.json();

      if (res.ok) {
        setBrands(data.data || []);
      } else {
        setBrands([]);
      }
    } catch (error) {
      console.log(error);
      setBrands([]);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="addfood-container">
      <h2 className="addfood-title">Add Food Item</h2>

      <form className="addfood-form" onSubmit={handleSubmit}>
        
        {/* CATEGORY */}
        <div className="form-group">
          <label>Category*</label>
          <select
            name="foodcategory"
            value={formData.foodcategory}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>

            {brands.length > 0 ? (
              brands.map((item, index) => (
                <option key={index} value={item.category}>
                  {item.category}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No category found
              </option>
            )}
          </select>
        </div>

        {/* ITEM NAME */}
        <div className="form-group">
          <label>Item Name*</label>
          <input
            type="text"
            name="itemname"
            value={formData.itemname}
            onChange={handleChange}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="form-group">
          <label>Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* QUANTITY */}
        <div className="form-group">
          <label>Quantity*</label>
          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        {/* PRICE */}
        <div className="form-group">
          <label>Price*</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        {/* IMAGE */}
        <div className="form-group">
          <label>Image*</label>
          <input
            type="file"
            name="image1"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        {/* BUTTONS */}
        <div className="button-group">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Saving..." : "Add Food"}
          </button>

          <button type="button" onClick={resetForm} className="cancel-btn">
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}