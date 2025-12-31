import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import background from "../assets/background.jpg"; 

const Home = () => {
  return (
    <div className="home-container">
      
      <section className="hero">
        <div className="hero-text">
          <h1 className="hero-title">Brew Haven</h1>
          <p className="hero-subtitle">Your Daily Escape in a Cup</p>
          <p className="hero-description">
            Step into Brew Haven and experience the perfect cup of coffee made
            just for you. Relax, enjoy, and savor every sip.
          </p>
          <Link to="/menu" className="hero-button">
            Explore Menu
          </Link>
        </div>

        <div className="hero-image">
          <img src={background} alt="Coffee" />
        </div>
      </section>
    </div>
  );
};

export default Home;

