import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "../styles/menu.css";


const Menu = ({ cart, setCart }) => {
  
  const hotRef = useRef(null);
  const coldRef = useRef(null);
  const dessertsRef = useRef(null);

  const [menuData, setMenuData] = useState({
    "hot-drinks": [],
    "cold-drinks": [],
    "desserts": [],
  });

  
  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await axios.get("http://localhost:5000/menu_items");
        const items = res.data;

        
        const grouped = {
          "hot-drinks": [],
          "cold-drinks": [],
          "desserts": [],
        };

        items.forEach((item) => {
          if (grouped[item.category]) {
            grouped[item.category].push(item);
          }
        });

        setMenuData(grouped);
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
      }
    }

    loadMenu();
  }, []);


  const handleAddToCart = (item) => {
  setCart((prevCart) => {
    const existingItem = prevCart.find((i) => i.name === item.name);

    if (existingItem) {
      
      return prevCart.map((i) =>
        i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      
      return [...prevCart, { ...item, quantity: 1 }];
    }
  });
};


  
  const scrollToRef = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="menu-page">
   
      <h1>Our Menu</h1>

      <div className="top-bar">
        <button onClick={() => scrollToRef(hotRef)}>Hot Drinks</button>
        <button onClick={() => scrollToRef(coldRef)}>Cold Drinks</button>
        <button onClick={() => scrollToRef(dessertsRef)}>Desserts</button>
      </div>

    
      {Object.keys(menuData).map((categoryId) => {
        const ref =
          categoryId === "hot-drinks"
            ? hotRef
            : categoryId === "cold-drinks"
            ? coldRef
            : dessertsRef;

        return (
          <div key={categoryId} ref={ref} className="category-section">
            <h2 className="category-header">
              {categoryId.replace("-", " ").toUpperCase()}
            </h2>

            <div className="items-list">
              {menuData[categoryId].map((item, index) => (
                <div key={index} className="menu-item">
                  <img
                    src={`http://localhost:5000/${item.image}`} 
                    alt={item.name}
                    className="menu-item-image"
                  />
                  <div className="menu-item-details">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p>${item.price}</p>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;



