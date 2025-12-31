import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/navbar';
import Home from './pages/home';
import Menu from './pages/menu'; 
import Footer from './components/footer';
import Cart from './pages/cart';
import LoginForm from "./components/loginform";
import AboutGalleryPage from './pages/aboutgallery';

function App() {
  const [cart, setCart] = useState([]);
  

  return (
    <Router>
      <Navbar />

      <div style={{ paddingTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<Menu cart={cart} setCart={setCart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/loginform" element={<LoginForm />} />
          <Route path="/aboutgallery" element={<AboutGalleryPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;









