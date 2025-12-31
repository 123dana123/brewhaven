import axios from "axios";
import React, { useState } from "react";
import '../styles/login.css';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");       
  const [password, setPassword] = useState(""); 
  const [message, setMessage] = useState("");  

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!email || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    try {
      const result = await axios.post("http://localhost:5000/users", { email, password });
      const userId = result.data.userId;

     
      localStorage.setItem("userId", userId);
      localStorage.setItem("userEmail", email);

      setMessage(result.data.message || "Login successful");

     
      setEmail("");
      setPassword("");

      if (onLogin) onLogin({ userId, email });
    } catch (err) {
      console.error(err);
      setMessage("Login failed. Please check your credentials.");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="login-form-container">
     
      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            autoComplete="off"
          />
        </div>

        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            autoComplete="new-password"
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;







