import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../css/menu.css";

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [qty, setQty] = useState({});

  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  // =====================================================
  // SEARCH FROM URL
  // =====================================================

  const query = new URLSearchParams(location.search);
  const search = query.get("search") || "";

  // =====================================================
  // CATEGORY BANNER IMAGES
  // =====================================================

  const categoryImages = {
    all: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    fastfood:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086",
    veg:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
    nonveg:
      "https://images.unsplash.com/photo-1604908177522-040f5f4f0f8d",
    southindian:
      "https://images.unsplash.com/photo-1630383249896-424e482df921",
    chinese:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246",
    pizza:
      "https://images.unsplash.com/photo-1601924582970-9238bcb495d9",
    drinks:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87",
    desserts:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b",
  };

  // =====================================================
  // FETCH FOODS
  // =====================================================

  useEffect(() => {
    fetchFoods();
  }, [category]);

  const fetchFoods = async () => {
    try {
      const res = await fetch(
        `https://foodorder-lafi.onrender.com/api/fooddata/${category}`
      );

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = await res.json();

      console.log("Food Data:", data);
      console.log("Items:", data.data);

      setFoods(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Food Fetch Error:", err);
      setFoods([]);
    }
  };

  // =====================================================
  // SEARCH FILTER
  // =====================================================

  const filteredFoods = foods.filter((item) =>
    (item.itemname || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  const increaseQty = (id) => {
    setQty((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  const decreaseQty = (id) => {
    setQty((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = async (item) => {
    if (!userId) {
      alert("Login first");
      navigate("/login");
      return;
    }

    const quantity = qty[item._id] || 1;

    try {
      const res = await fetch(
        "https://foodorder-lafi.onrender.com/api/addcart",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId,
            foodId: item._id,
            itemname: item.itemname,
            price: item.price,
            quantity,
            image1: item.image1,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add cart");
      }

      alert("✅ Added to cart");

      console.log("Cart Response:", data);
    } catch (error) {
      console.error("ADD CART ERROR:", error);

      alert(error.message || "Something went wrong");
    }
  };

  // =====================================================
  // IMAGE ERROR
  // =====================================================

  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/300x200?text=Food+Image";
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="menu-container">

      {/* =================================================
          CATEGORY BANNER
      ================================================= */}

      <div className="category-banner">
        <img
          src={categoryImages[category] || categoryImages.all}
          alt={category || "Food"}
        />

        <div className="banner-overlay">
          <h1>
            {category
              ? `${category.toUpperCase()} FOOD`
              : "ALL FOOD"}
          </h1>
        </div>
      </div>

      {/* =================================================
          TITLE
      ================================================= */}

      <h2>
        {category || "All"} Food{" "}
        {search && `- Search: "${search}"`}
      </h2>

      {/* =================================================
          FOOD GRID
      ================================================= */}

      <div className="menu-grid">

        {filteredFoods.length === 0 ? (
          <h3>No Food Found 😔</h3>
        ) : (
          filteredFoods.map((item) => (
            <div className="menu-card" key={item._id}>

              {/* =================================================
                  CLOUDINARY IMAGE
              ================================================= */}

              <img
                src={item.image1}
                alt={item.itemname || "Food"}
                className="menu-img"
                onError={handleImageError}
              />

              {/* =================================================
                  FOOD NAME
              ================================================= */}

              <h4>{item.itemname}</h4>

              {/* =================================================
                  QUANTITY
              ================================================= */}

              <div className="qty-box">

                <button
                  type="button"
                  onClick={() => decreaseQty(item._id)}
                >
                  -
                </button>

                <span>
                  {qty[item._id] || 1}
                </span>

                <button
                  type="button"
                  onClick={() => increaseQty(item._id)}
                >
                  +
                </button>

              </div>

              {/* =================================================
                  PRICE + CART
              ================================================= */}

              <div className="card-bottom">

                <span className="price">
                  ₹{item.price}
                </span>

                <button
                  type="button"
                  className="order-btn"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>

              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}