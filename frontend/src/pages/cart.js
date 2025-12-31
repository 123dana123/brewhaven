import React, { useState } from "react";
import CartItem from "../components/cartitem";
import CartForm from "../components/cartform";
import "../styles/cart.css";

const Cart = ({ cart, setCart }) => {
  const [submitted, setSubmitted] = useState(false);
  const [total, setTotal] = useState(0);

  
  const removeFromCart = (name) => {
    const updatedCart = cart.map((item) => {
      if (item.name === name) {
    
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }).filter(item => item.quantity > 0); 

    setCart(updatedCart);
  };

  
  const handleSubmitSuccess = (formData) => {
    
    const sum = cart.reduce((acc, item) => {
      const price = parseFloat(item.price.replace("$", ""));
      return acc + price * (item.quantity || 1);
    }, 0);

    setTotal(sum);
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 3000);

    setCart([]);
  };

  return (
    <div className="cart-page">
      {submitted && (
        <div className="thank-you-message">
          <h2>Thank you for your order!</h2>
          <p>Total: ${total.toFixed(2)}</p>
        </div>
      )}

      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items-list">
          {cart.map((item, index) => (
            <CartItem
              key={index}
              name={item.name}
              price={item.price}
              quantity={item.quantity || 1}
              onRemove={() => removeFromCart(item.name)}
            />
          ))}
        </div>
      )}

      <CartForm cart={cart} setCart={setCart} onSubmitSuccess={handleSubmitSuccess} />
    </div>
  );
};

export default Cart;



