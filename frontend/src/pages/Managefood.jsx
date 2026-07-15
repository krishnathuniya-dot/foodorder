import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "../css/fooddata.css";

export default function Managefood() {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const fetchFoods = async () => {
    try {
      const res = await fetch("http://localhost:2340/api/fooddata");
      const data = await res.json();
      setFoods(data.data || []);
    } catch (error) {
      console.log("Error fetching food data:", error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      const res = await fetch(`https://foodorder-lafi.onrender.com/api/deletefood/${id}`, {
        method: "DELETE",
      });

      if (res.ok) fetchFoods();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  const categories = ["All", ...new Set(foods.map((f) => f.foodcategory))];

  const filteredFoods = foods.filter((food) => {
    const searchLow = searchTerm.toLowerCase().trim();

    return (
      (food.itemname?.toLowerCase().includes(searchLow) ||
        food.foodcategory?.toLowerCase().includes(searchLow) ||
        food.price?.toString().includes(searchLow) ||
        food.quantity?.toString().includes(searchLow)) &&
      (category === "All" || food.foodcategory === category)
    );
  });

  return (
    <div className="food-container">
      <h2 className="food-title">🍔 Manage Food</h2>

      {/* 🔍 Filters */}
      <div className="food-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search name, category, price..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat, i) => (
            <option key={i}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 📋 Table */}
      <div className="table-wrapper">
        <table className="food-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredFoods.length > 0 ? (
              filteredFoods.map((v, index) => (
                <tr key={v._id}>
                  <td>{index + 1}</td>

                  <td>
                    <span className="category-badge">
                      {v.foodcategory}
                    </span>
                  </td>

                  <td>{v.itemname}</td>
                  <td>{v.quantity}</td>
                  <td className="price">₹{v.price}</td>

                  <td>
                    {v.createdAt
                      ? new Date(v.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    <div className="action-btns">
                      <Link to={`/edit/${v._id}`} className="edit-btn">
                        <FaEdit />
                      </Link>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(v._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No food found 😢
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}