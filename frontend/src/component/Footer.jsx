import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const categories = [
  { name: "All", value: "all", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" },
  { name: "Fast Food", value: "fastfood", img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80" },
  { name: "Veg", value: "veg", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80" },
 { name: "Non Veg", value: "nonveg", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&q=80" },
  { name: "South Indian", value: "southindian", img: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80" },
  { name: "Chinese", value: "chinese", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80" },
  { name: "Pizza", value: "pizza", img: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=400&q=80" },
  { name: "Drinks", value: "drinks", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80" },
  { name: "Desserts", value: "desserts", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80" }
];

export default function Footer() {
  const [foods, setFoods] = useState([]);
  const [qty, setQty] = useState({});
  const [loaded, setLoaded] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // 🔥 NEW STATES
  const [selectedImg, setSelectedImg] = useState(null);
  const [zoom, setZoom] = useState(1);

  const itemsPerPage = 20;

  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem("userId");

  const query = new URLSearchParams(location.search);
  const search = query.get("search") || "";

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await fetch("http://localhost:2340/api/fooddata");
      const data = await res.json();
      setFoods(data.data || []);
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  const filteredFoods = foods.filter((item) =>
    item.itemname.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFoods = filteredFoods.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const increaseQty = (id) => {
    setQty((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const decreaseQty = (id) => {
    setQty((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  const addToCart = async (item) => {
    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const quantity = qty[item._id] || 1;

    await fetch("http://localhost:2340/api/addcart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        foodId: item._id,
        itemname: item.itemname,
        price: item.price,
        quantity,
        image1: item.image1,
      }),
    });

    alert("Added to cart");
  };

  return (
    <div className="food-page">
  {/* 🛒 KT FLOATING CART */}
<div className="kt-floatingCart" onClick={() => navigate("/cart")}>
  
  <div className="kt-cartIcon">🛒</div>

  <div className="kt-cartInfo">
    <p className="kt-cartTitle">Cart</p>
  </div>

</div>

      {/* CATEGORY */}
      <div className="category-container">
        {categories.map((cat) => (
          <Link
            key={cat.value}
            to={cat.value === "all" ? "/" : `/menu/${cat.value}`}
            className="category-card"
          >
            <img src={cat.img} alt={cat.name} />
            <div className="overlay">
              <h3>{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>

      <br /><br />

      {/* FOOD GRID */}
      <div className="food-grid">

        {currentFoods.length === 0 ? (
          <h3 style={{ textAlign: "center" }}>😔 No Food Found</h3>
        ) : (
          currentFoods.map((v) => (
            <div className="food-card" key={v._id}>

              <div className="food-img">

                {!loaded[v._id] && <div className="skeleton"></div>}

                <img
                  src={`http://localhost:2340/uploads/${v.image1}`}
                  alt={v.itemname}
                  className={loaded[v._id] ? "img show" : "img"}
                  onClick={() => {
                    setSelectedImg(`http://localhost:2340/uploads/${v.image1}`);
                    setZoom(1);
                  }}
                  onLoad={() =>
                    setLoaded((prev) => ({
                      ...prev,
                      [v._id]: true,
                    }))
                  }
                />
              </div>

              <div className="food-info">
                <h3>{v.itemname}</h3>

                <div className="qty">
                  <button onClick={() => decreaseQty(v._id)}>-</button>
                  <span>{qty[v._id] || 1}</span>
                  <button onClick={() => increaseQty(v._id)}>+</button>
                </div>

                <div className="bottom">
                  <span>₹ {v.price}</span>

                  <button onClick={() => addToCart(v)}>
                    Order Now
                  </button>
                </div>

              </div>

            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="pagination">

        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>

      </div>

      {/* 🔥 IMAGE MODAL */}
      {selectedImg && (
        <div className="image-modal" onClick={() => setSelectedImg(null)}>

          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <img
              src={selectedImg}
              alt="zoom"
              style={{ transform: `scale(${zoom})` }}
            />

            <div className="zoom-controls">
              <button onClick={() => setZoom(zoom + 0.2)}>+</button>
              <button onClick={() => setZoom(zoom > 1 ? zoom - 0.2 : 1)}>-</button>
              <button onClick={() => setSelectedImg(null)}>Close</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}