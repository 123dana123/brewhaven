import React, { useState } from "react";
import axios from "axios";
import '../styles/messageform.css';
function MessageForm({ loggedInUser, fetchMessages }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) {
      setStatus("Please enter name and message");
      setTimeout(() => setStatus(""), 3000);
      return;
    }

    try {
      await axios.post("http://localhost:5000/comments", {
        name,
        message,
        userId: loggedInUser ? loggedInUser.id : null,
      });

      setName("");
      setMessage("");
      setStatus("Message added!");
      if (fetchMessages) fetchMessages(); 
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to add message");
    }
  };

  return (
    <div className="message-form-container">
      {status && <div className="status-message">{status}</div>}

   
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default MessageForm;







