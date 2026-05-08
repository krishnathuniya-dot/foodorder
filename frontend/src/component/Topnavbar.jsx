import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCarSide,
  FaEnvelope,
  FaPhoneAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaGooglePlusG,
  FaInstagram,
} from "react-icons/fa";

export default function Topnavbar() {
  const [showModal, setShowModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    LastName: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Password not match");
      return;
    }

    const res = await fetch("http://localhost:2340/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Register Successfully");
      setIsRegister(false);
    } else {
      alert(data.message);
    }
  };

  const handleLogin = async () => {
    const res = await fetch("http://localhost:2340/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Login Success");

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userId", data.user._id);

      setUser(data.user);
      setShowModal(false);
    } else {
      alert(data.message);
    }
  };

  return (
    <>
      <div className="fi-navbar">
        

  {/* 🔵 LEFT SIDE - SOCIAL ICONS */}

          <div className="mi-social-icons">
            <FaFacebookF />
            <FaTwitter />
            <FaLinkedinIn />
            <FaGooglePlusG />
            <FaInstagram />
            
          </div>
        <div className="fi-nav-right">
          

          {user ? (
            <div>
              <Link to="/account" style={{color:"white", textDecoration:'none'}}>My Account</Link>
            </div>
          ) : (
            <>
              <div
                className="fi-login"
                onClick={() => {
                  setShowModal(true);
                  setIsRegister(false);
                }}
              >
                LOGIN
              </div>

              <div
                className="fi-signup"
                onClick={() => {
                  setShowModal(true);
                  setIsRegister(true);
                }}
              >
                SIGNUP
              </div>
            </>
          )}

        </div>
      </div>

      {showModal && (
        <div className="fi-modal-overlay">
          <div className="fi-modal-box">

            <span
              className="fi-close-btn"
              onClick={() => setShowModal(false)}
            >
              ✖
            </span>

            <h2>{isRegister ? "Register" : "Login"}</h2>

            {isRegister ? (
              <>
                <input name="firstName" placeholder="First Name" onChange={handleChange} />
                <input name="LastName" placeholder="Last Name" onChange={handleChange} />
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="contact" placeholder="Contact" onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} />
                <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} />

                <button className="fi-login-btn" onClick={handleRegister}>
                  Register
                </button>

                <p>
                  Already have an account?{" "}
                  <span className="fi-link" onClick={() => setIsRegister(false)}>
                    Login
                  </span>
                </p>
              </>
            ) : (
              <>
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} />

                <button className="fi-login-btn" onClick={handleLogin}>
                  Login
                </button>

                <p>
                  Don't have an account?{" "}
                  <span className="fi-link" onClick={() => setIsRegister(true)}>
                    Register
                  </span>
                </p>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}