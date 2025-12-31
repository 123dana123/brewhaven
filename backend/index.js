const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const pool = require("./db"); 

const app = express();
console.log("INDEX.JS LOADED");

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
app.get("/menu_items", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM menu_items ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/orders", async (req, res) => {
  try {
    const { customer, cart } = req.body;

    
    const [orderResult] = await pool.query(
      "INSERT INTO orders (name, email, address, phone, total_price) VALUES (?, ?, ?, ?, ?)",
      [
        customer.name,
        customer.email,
        customer.address,
        customer.phone,
        cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
      ]
    );

    const orderId = orderResult.insertId; 

   
    for (const item of cart) {
      await pool.query(
        "INSERT INTO order_items (order_id, name, price, quantity) VALUES (?, ?, ?,?)",
        [orderId, item.name, item.price, item.quantity] 
      );
    }

    res.json({ success: true, message: "Order saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

   
    const [existingUsers] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      
      return res.json({ success: true, message: "User already exists", userId: existingUsers[0].id });
    }

    
    const [insertResult] = await pool.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, password]
    );

    res.json({ success: true, message: "Account created", userId: insertResult.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});


app.post("/comments", async (req, res) => {
  const { name, message, userId } = req.body;

  if (!name || !message) {
    return res.status(400).json({ message: "Name and message required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO comments (name, message, userId, created_at) VALUES (?, ?, ?, NOW())",
      [name, message, userId || null]
    );

    res.json({ message: "Message added successfully", id: result.insertId });
  } catch (err) {
    console.error("SQL Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/comments/:id", async (req, res) => {
  const { email, message } = req.body;
  const { id } = req.params;

  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const [users] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(403).json({ message: "Unauthorized email" });

    await pool.query("UPDATE comments SET message = ? WHERE id = ?", [message, id]);
    res.json({ message: "Message updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/comments/:id", async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const [users] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(403).json({ message: "Unauthorized email" });

    await pool.query("DELETE FROM comments WHERE id = ?", [id]);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/check-user", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const [rows] = await pool.query("SELECT id, email FROM users WHERE email = ?", [email]);

    if (rows.length === 0) return res.json({ user: null });

    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.post("/replies", async (req, res) => {
  const { commentId, reply } = req.body;

  if (!commentId || !reply) {
    return res.status(400).json({ message: "Comment ID and reply required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO replies (commentId, reply, created_at) VALUES (?, ?, NOW())",
      [commentId, reply]
    );

    res.json({ message: "Reply added successfully", id: result.insertId });
  } catch (err) {
    console.error("SQL Error:", err);
    res.status(500).json({ error: err.message });
  }
});



app.get("/comments", async (req, res) => {
  try {
    const [comments] = await pool.query("SELECT * FROM comments ORDER BY created_at DESC");
    const [replies] = await pool.query("SELECT * FROM replies");

    const commentsWithReplies = comments.map((c) => ({
      ...c,
      replies: replies.filter((r) => r.commentId === c.id),
    }));

    res.json(commentsWithReplies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


const upload = multer({ storage });

app.get("/", (req, res) => {
  res.json({ message: "Backend running" });
});

app.use((req, res, next) => {
  if (req.method === "POST") {
    console.log("POST HIT:", req.originalUrl);
    console.log("BODY:", req.body);
  }
  next();
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});