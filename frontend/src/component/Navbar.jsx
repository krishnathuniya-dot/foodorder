import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";
import { useParams, useNavigate } from "react-router-dom";


export default function Navbar() {
  const navigate = useNavigate();
  
  const [showMenu, setShowMenu] = useState(false);

  

  return (
  
    <>
      <div className="fig-navbar">
        <div className="fi-logo">FOS</div>

        <div className="fig-menu">
          <Link to="/">Home</Link>

          {/* DROPDOWN */}
          <div
            className="fig-dropdown"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <span className="fig-menu-link">Food Menu</span>

            {showMenu && (
              <div className="fig-dropdown-box">
              <Link to="/menu/Italian">Italian</Link>
<Link to="/menu/fastfood">fastfood</Link>
<Link to="/menu/SouthIndian">South Indian</Link>
<Link to="/menu/NorthIndian">North Indian</Link>
<Link to="/menu/Desserts">Desserts</Link>
<Link to="/menu/Starters">Starters</Link>
<Link to="/menu/Chinese">Chinese</Link>
              </div>
            )}
          </div>

          <Link to="/track">Track Order</Link>
          <Link to="/contact">Contact us</Link>
        </div>

       <button className="cart-btn" onClick={() => navigate("/cart")}>
        🛒 Go to Cart
      </button>

      </div>
    </>
  );
}