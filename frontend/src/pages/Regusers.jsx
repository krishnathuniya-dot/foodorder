import React, { useEffect, useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import "../css/reguser.css";

export default function Regusers() {
  const [quotes, setQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchQuotes = async () => {
    try {
      const res = await fetch("http://localhost:2340/api/reguser");
      const data = await res.json();
      setQuotes(data.data || []);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const deleteQuote = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await fetch(`http://localhost:2340/api/managequote/${id}`, {
        method: "DELETE",
      });

      setQuotes((prev) => prev.filter((q) => q._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // 🔍 Advanced Search
  const filteredQuotes = quotes.filter((q) => {
    const searchLow = searchTerm.toLowerCase().trim();
    const fullName = `${q.firstName} ${q.LastName}`.toLowerCase();

    return (
      fullName.includes(searchLow) ||
      q.email?.toLowerCase().includes(searchLow) ||
      q.contact?.toString().includes(searchLow)
    );
  });

  return (
    <div className="reg-container">
      <h2 className="reg-title">👤 Registered Users</h2>

      {/* 🔍 Search + Count */}
      <div className="reg-controls">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="reg-total">
          Total Users: <span>{filteredQuotes.length}</span>
        </div>
      </div>

      {/* 📋 Table */}
      <div className="reg-table-wrapper">
        <table className="reg-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Reg Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map((q, index) => (
                <tr key={q._id}>
                  <td>{index + 1}</td>

                  <td className="user-name">
                    {q.firstName} {q.LastName}
                  </td>

                  <td>{q.email}</td>
                  <td>{q.contact}</td>

                  <td>
                    {q.createdAt
                      ? new Date(q.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteQuote(q._id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No users found 😢
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}