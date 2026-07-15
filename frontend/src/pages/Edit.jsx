import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/edit.css";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    foodcategory: "",
    itemname: "",
    description: "",
    quantity: "", 
    price: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  
  useEffect(() => {
    async function fetchFood() {
      try {
        const res = await fetch(`https://foodorder-lafi.onrender.com/api/foodadd/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Food not found");
        }

        const food = data.data || data;

        setFormData({
          foodcategory: food.foodcategory || "",
          itemname: food.itemname || "",
          description: food.description || "",
          quantity: food.quantity || "",
          price: food.price || "",
        });

        setPreview(
          food.image1
            ? `http://localhost:2340/uploads/${food.image1}`
            : ""
        );
      } catch (error) {
        console.log("Fetch error:", error);
        alert("Food load failed ❌");
      } finally {
        setLoading(false);
      }
    }

    fetchFood();
  }, [id]);

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      form.append("foodcategory", formData.foodcategory);
      form.append("itemname", formData.itemname);
      form.append("description", formData.description);
      form.append("quantity", formData.quantity);
      form.append("price", formData.price);

      if (image) {
        form.append("image1", image);
      }

      const res = await fetch(
        `http://localhost:2340/api/updatefood/${id}`,
        {
          method: "PUT",
          body: form,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      alert("Food updated successfully ");
      navigate("/managefood");
    } catch (error) {
      console.log("Update error:", error);
      alert("Food update failed ❌");
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div className="av-wrapper">
      <div className="av-container">
        <h2 className="av-title">Edit Food</h2>

        <form className="av-form" onSubmit={handleSubmit}>
          
          {/* Category */}
          <div className="av-group">
            <label>Food Category</label>
            <input
              type="text"
              name="foodcategory"
              value={formData.foodcategory}
              onChange={handleChange}
              required
            />
          </div>

          {/* Name */}
          <div className="av-group">
            <label>Item Name</label>
            <input
              type="text"
              name="itemname"
              value={formData.itemname}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="av-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Quantity */}
          <div className="av-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>

          {/* Price */}
          <div className="av-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Image */}
          <div className="av-group">
            <label>Food Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && <img src={preview} alt="preview" className="av-preview" />}
          </div>

          <button type="submit" className="av-btn">
            Update Food
          </button>
        </form>
      </div>
    </div>
  );
}