import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/ccc.css";

const categories = [
  { name: "All", value: "all", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" },
  { name: "Fast Food", value: "fastfood", img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80" },
  { name: "Veg", value: "veg", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80" },
 { name: "Non Veg", value: "nonveg", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&q=80" },
  { name: "South Indian", value: "southindian", img: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80" },
  { name: "Chinese", value: "chinese", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80" },
  { name: "Pizza", value: "pizza", img: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=400&q=80" },
  { name: "Drinks", value: "drinks", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80" },
  { name: "Desserts", value: "desserts", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80" },
  
  { name: "All", value: "all", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" },

  { name: "Fruits", value: "fruits", img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80" },

  { name: "Apple", value: "apple", img: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80" },

 { name: "Banana", value: "banana", img: "https://images.unsplash.com/photo-1574226516831-e1dff420e12b?w=400&q=80" },
   { name: "Mango", value: "mango", img: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=400&q=80" },

  { name: "Orange", value: "orange", img: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&q=80" },

  { name: "Strawberry", value: "strawberry", img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80" },

  { name: "Fast Food", value: "fastfood", img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80" },

  { name: "Veg", value: "veg", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80" },

  { name: "Non Veg", value: "nonveg", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&q=80" },

  { name: "South Indian", value: "southindian", img: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80" },

  { name: "Chinese", value: "chinese", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80" },

  { name: "Pizza", value: "pizza", img: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=400&q=80" },

  { name: "Drinks", value: "drinks", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80" },

  { name: "Desserts", value: "desserts", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80" }

];

export default function Categoryy() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrame;
    let scrollAmount = 0;

    const slide = () => {
      scrollAmount += 0.5;
      container.scrollLeft += 0.5;

      if (scrollAmount >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
        scrollAmount = 0;
      }

      animationFrame = requestAnimationFrame(slide);
    };

    animationFrame = requestAnimationFrame(slide);

    const stop = () => cancelAnimationFrame(animationFrame);
    const start = () => {
      animationFrame = requestAnimationFrame(slide);
    };

    container.addEventListener("mouseenter", stop);
    container.addEventListener("mouseleave", start);

    return () => {
      cancelAnimationFrame(animationFrame);
      container.removeEventListener("mouseenter", stop);
      container.removeEventListener("mouseleave", start);
    };
  }, []);

  return (
    <div className="cat-wrapper">
      
      {/* CATEGORY SLIDER */}
      <div className="cat-container" ref={scrollRef}>
        {[...categories, ...categories].map((cat, index) => (
          <Link
            key={index}
            to={cat.value === "all" ? "/" : `/menu/${cat.value}`}
            className="cat-card"
          >
            <img src={cat.img} alt={cat.name} loading="lazy" />
            <div className="cat-overlay">
              <h3>{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* FOOTER */}
   <footer className="footer">
  <div className="footer-container">

    <div className="footer-logo">
      <h2>Food Ordering<br />System</h2>
    </div>

    <div>
      <h3>INFORMATION</h3>
      <ul>
        <li><Link to="/about">About us</Link></li>
        <li><Link to="/contact">Contact us</Link></li>
      </ul>
    </div>

    <div>
      <h3>My Account</h3>
      <ul>
        <li><Link to="/account">My Account</Link></li>
        <li><Link to="/cart">My Cart</Link></li>
        <li><Link to="/orders">My Orders</Link></li>
        <li><Link to="/track">Track Order</Link></li>
      </ul>
    </div>

    <div>
      <h3>Admin</h3>
      <ul>
        <li><Link to="/admin">Admin Login</Link></li>
      </ul>
    </div>

  </div>

  <div className="footer-bottom">
    Food Ordering System
  </div>
</footer>

    </div>
  );
}