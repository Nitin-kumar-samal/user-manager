const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();

// Middleware to read JSON body
app.use(express.json());

// MongoDB Connection
mongoose
    .connect(
        "mongodb+srv://nitinrcp_db_user:nitin123@cluster11.srqrexw.mongodb.net/?appName=Cluster11"
    )
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Connection Error:", err));

// ================= ROUTES =================

// Home Route
app.get("/", (req, res) => {
    res.send("Hello from Express Server");
});

// About Route
app.get("/about", (req, res) => {
    res.send("This is About Page");
});

app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message,
        });
    }
});



// 🔥 TEST USER SAVE ROUTE (VERY IMPORTANT)
app.get("/create-user", async (req, res) => {
    try {
        const user = await User.create({
            name: "WCTM",
            email: "testuser10@gmail.com",
            password: "1234567810",
        });

        res.json({
            message: "User saved successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error saving user",
            error: error.message,
        });
    }
});

//login route

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    // 2️⃣ Check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 3️⃣ Compare password (bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id },       // Payload
      "mysecretkey",          // Secret key
      { expiresIn: "1h" }     // Expiry time
    );

    // 5️⃣ Send response (without password)
    res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});


console.log("LOGIN ROUTE FILE RUNNING");

app.get("/api/profile", async (req, res) => {
    try {
        // 1️⃣ Header se token lo
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "No token provided",
            });
        }

        // 2️⃣ Token verify karo
        const decoded = jwt.verify(token, "mysecretkey");

        // 3️⃣ User find karo
        const user = await User.findById(decoded.id).select("-password");

        res.status(200).json(user);

    } catch (error) {
        res.status(401).json({
            message: "Invalid token",
        });
    }
});

// ================= SERVER =================
app.listen(5000, () => {
    console.log("Express server running on port 5000");
});