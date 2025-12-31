import { useState } from "react";
import axios from "axios";
import "../styles/cart.css";

function CartForm({ cart, setCart, onSubmitSuccess }) {
  const [state, setState] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
    setErrorMessage(""); 
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const { name, email, address, phone } = state;

  
  if (cart.length === 0) {
    setErrorMessage("Please add items to your cart before submitting.");
    return;
  }

 
  if (!name || !email || !address || !phone) {
    setErrorMessage("Please fill in all fields.");
    return;
  }

  createOrder();
};

  const createOrder = async () => {
    try {
      const payload = {
        customer: state,
        cart: cart.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
        })),
      };

      const res = await axios.post("http://localhost:5000/orders", payload);
      console.log("Order saved:", res.data);

      onSubmitSuccess(state);

      setState({ name: "", email: "", address: "", phone: "" });
      setCart([]);
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to save order:", error);
      setErrorMessage("Failed to save order. Try again.");
    }
  };

  return (
    <form id="cart-form" onSubmit={handleSubmit}>
      <h2>Enter Your Details</h2>

     
      {errorMessage && <p className="form-error">{errorMessage}</p>}

      <div>
        <label>Name</label>
        <input
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Enter your name..."
        />
      </div>

      <div>
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Enter your email..."
        />
      </div>

      <div>
        <label>Address</label>
        <input
          name="address"
          value={state.address}
          onChange={handleChange}
          placeholder="Enter your address..."
        />
      </div>

      <div>
        <label>Phone</label>
        <input
          name="phone"
          type="tel"
          value={state.phone}
          onChange={handleChange}
          placeholder="Enter your phone number..."
        />
      </div>

      <button type="submit">Submit Order</button>
    </form>
  );
}

export default CartForm;




