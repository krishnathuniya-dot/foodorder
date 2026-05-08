import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/header.css";
import Footer from "./Footer";
import Categoryy from "./Categoryy";

export default function Header() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (search.trim() === "") return;

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:2340/api/search?query=${search}`
      );

      const data = await res.json();

      if (data.success) {
        // results Menu page ko bhejo
        navigate("/menu/all", {
          state: { results: data.foods, searchText: search },
        });
      } else {
        navigate("/menu/all", {
          state: { results: [], searchText: search },
        });
      }

    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fi-hero">
      <div className="fi-overlay">

        <h2 className="fi-subtitle">
          Delicious <span>Food</span>
        </h2>

        <h1 className="fi-title">
          Order Delivery & Take-Out
        </h1>

        {/* 🔍 Search Box */}
        <div className="fi-search-box">

          <input
            type="text"
            placeholder="Search food by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <button onClick={handleSearch}>
            {loading ? "Searching..." : "SEARCH"}
          </button>

        </div>

      </div>

      <Footer />
      <Categoryy />
    </div>
  );
}