import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/navbar.css";

function Navbar() {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => setMenuActive(!menuActive);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        

        <div className={`links ${menuActive ? "active" : ""}`}>
          <Link to="/" onClick={() => setMenuActive(false)}>Home</Link>
          <Link to="/menu" onClick={() => setMenuActive(false)}>Menu</Link>
          <Link to="/aboutgallery" onClick={() => setMenuActive(false)}>About & Gallery</Link>
          <Link to="/cart" onClick={() => setMenuActive(false)}>Cart</Link>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;