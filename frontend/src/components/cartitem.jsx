import React from "react";
import "../styles/cartitem.css";
function CartItem(props) {
  return (
    <div className="cart-item">
      <h3>{props.name}</h3>
      <p>Price: ${props.price}</p>
      <p>Quantity: {props.quantity}</p>
      <button className="remove-btn" onClick={props.onRemove}>❌</button>
    </div>
  );
}

export default CartItem; 
