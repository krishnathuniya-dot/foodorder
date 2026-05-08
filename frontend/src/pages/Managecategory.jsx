import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/managecategory.css";

export default function Managecategory() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:2340/api/categorydata");
      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm("Delete this category?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:2340/api/deletebrand/${id}`, {
        method: "DELETE",
      });

      setCategories((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const filteredData = categories.filter((c) =>
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="yy-container">
      <div className="yy-card">

        {/* HEADER */}
        <div className="yy-header">
          <h2>Manage Category</h2>

          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="yy-search"
          />
        </div>

        {/* TABLE */}
        <div className="yy-table-wrapper">
          <table className="yy-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((c, index) => (
                  <tr key={c._id} className="yy-row">

                    <td className="yy-td yy-index">
                      <span>{index + 1}</span>
                    </td>

                    <td className="yy-td yy-category">
                      <span className="yy-pill">{c.category}</span>
                    </td>

                    <td className="yy-td yy-date">
                      <span>
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </span>
                    </td>

                    <td className="yy-td yy-actions">
                      <button
                        className="yy-btn yy-delete"
                        onClick={() => deleteCategory(c._id)}
                      >
                        Delete
                      </button>

                      <Link
                        to={`/brandedit/${c._id}`}
                        className="yy-btn yy-edit"
                      >
                        Edit
                      </Link>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="yy-no-data">
                    No category found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}