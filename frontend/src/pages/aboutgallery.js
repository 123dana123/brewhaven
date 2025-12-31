import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/aboutgallery.css";
import MessageForm from "../components/messageform";
import LoginIcon from "@mui/icons-material/Login";
import axios from "axios";


import int1 from "../assets/int1.jpg";
import int2 from "../assets/int2.jpg";
import cust1 from "../assets/cust1.jpg";
import cust2 from "../assets/cust2.jpg";
import barista1 from "../assets/barista1.jpg";
import barista2 from "../assets/barista2.jpg";

const galleryImages = [int1, int2, cust1, cust2, barista1, barista2];

const AboutGalleryPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [toggleMenuId, setToggleMenuId] = useState(null);

  const [emailPrompt, setEmailPrompt] = useState({ id: null, action: null });
  const [emailInput, setEmailInput] = useState("");
  const [editMessage, setEditMessage] = useState("");

  const [showRepliesId, setShowRepliesId] = useState(null);
  const [replyInput, setReplyInput] = useState({});

  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/comments");
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const prevSlide = () =>
    setCurrentIndex(
      currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1
    );

  const nextSlide = () =>
    setCurrentIndex(
      currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1
    );

  const toggleMenu = (id) => {
    setToggleMenuId(toggleMenuId === id ? null : id);
    setEmailPrompt({ id: null, action: null });
    setEmailInput("");
    setEditMessage("");
  };

  const handleActionWithEmail = async (msgId, action) => {
    if (!emailInput) return;

    try {
      const res = await axios.post("http://localhost:5000/check-user", {
        email: emailInput,
      });

      if (!res.data.user) {
        navigate("/loginform");
        return;
      }

      if (action === "edit") {
        if (!editMessage) return;

        await axios.put(`http://localhost:5000/comments/${msgId}`, {
          message: editMessage,
          email: emailInput,
        });
      }

      if (action === "delete") {
        await axios.delete(`http://localhost:5000/comments/${msgId}`, {
          data: { email: emailInput },
        });
      }

      setToggleMenuId(null);
      setEmailPrompt({ id: null, action: null });
      setEmailInput("");
      setEditMessage("");
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReply = async (msgId) => {
    const replyText = replyInput[msgId];
    if (!replyText || replyText.trim() === "") return;

    try {
      const res = await axios.post("http://localhost:5000/replies", {
        commentId: msgId,
        reply: replyText.trim(),
      });
      console.log("Reply added:", res.data);

      setReplyInput((prev) => ({ ...prev, [msgId]: "" }));
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="about-gallery-page">
      <Link to="/loginform">
        <LoginIcon className="login-icon" />
      </Link>

      <section className="about-section">
        <h1>Our History</h1>
        <p>
   Brew Haven, founded in 2015, is a cozy coffee shop dedicated to high-quality coffee and a welcoming atmosphere. We serve carefully crafted drinks and fresh pastries, perfect for a quick espresso, a casual meet-up, or a relaxing study session.

Our friendly baristas ensure every visit feels personal. At Brew Haven, it’s more than coffee—it’s a place to connect, unwind, and enjoy the little moments.
        </p>
      </section>

      <section className="gallery-section">
        <h1>Gallery</h1>
        <div className="carousel-container">
          <button className="arrow left" onClick={prevSlide}>
            &#10094;
          </button>
          <img
            src={galleryImages[currentIndex]}
            alt="Gallery"
            className="carousel-image"
          />
          <button className="arrow right" onClick={nextSlide}>
            &#10095;
          </button>
        </div>
      </section>

      <section className="customer-messages-section">
        <h1>Share Your Thoughts</h1>
        <MessageForm fetchMessages={fetchMessages} />

        <div className="messages-list">
          {messages.map((msg) => (
            <div key={msg.id} className="message-card">
              <div className="message-header">
                <h4>{msg.name}</h4>
                <small>{new Date(msg.created_at).toLocaleString()}</small>
                <span className="menu-toggle" onClick={() => toggleMenu(msg.id)}>⋮</span>
              </div>

              <p className="message-text">{msg.message}</p>

              {toggleMenuId === msg.id && (
                <div className="edit-delete-container">
                  {emailPrompt.id !== msg.id ? (
                    <>
                      <button onClick={() => setEmailPrompt({ id: msg.id, action: "edit" })}>
                        Edit
                      </button>
                      <button onClick={() => setEmailPrompt({ id: msg.id, action: "delete" })}>
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="email-input"
                      />
                      {emailPrompt.action === "edit" && (
                        <textarea
                          placeholder="Edit your comment"
                          value={editMessage}
                          onChange={(e) => setEditMessage(e.target.value)}
                          className="edit-textarea"
                        />
                      )}
                      <button onClick={() => handleActionWithEmail(msg.id, emailPrompt.action)}>
                        {emailPrompt.action === "edit" ? "Confirm Edit" : "Confirm Delete"}
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className="reply-toggle">
                <button
                  onClick={() =>
                    setShowRepliesId(showRepliesId === msg.id ? null : msg.id)
                  }
                >
                  {showRepliesId === msg.id ? "Hide Replies ▲" : "View Replies ▼"}
                </button>
              </div>

              {showRepliesId === msg.id && (
                <div className="replies-container">
                  {msg.replies && msg.replies.length === 0 && <p className="no-replies">No replies yet</p>}
                  {msg.replies &&
                    msg.replies.map((r) => (
                      <div key={r.id} className="reply-item">
                        <small>{new Date(r.created_at).toLocaleString()}</small>
                        <p>{r.reply}</p>
                      </div>
                    ))}

                  <div className="reply-input-container">
                    <textarea
                      placeholder="Write a reply..."
                      value={replyInput[msg.id] || ""}
                      onChange={(e) =>
                        setReplyInput((prev) => ({ ...prev, [msg.id]: e.target.value }))
                      }
                    />
                    <button onClick={() => handleAddReply(msg.id)}>Reply</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutGalleryPage;






















