require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const authenticateToken = require("./utilities");
//Import Models
const User = require("./models/user.model");
const Notes = require("./models/note.model");

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://my-todo-app-frontend.onrender.com",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Middleware
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create Account (POST)
app.post("/create-account", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName) {
      return res
        .status(400)
        .json({ error: true, message: "Please enter your full name." });
    }

    if (!email) {
      return res
        .status(400)
        .json({ error: true, message: "Please enter your email." });
    }

    if (!password) {
      return res
        .status(400)
        .json({ error: true, message: "Please enter your password." });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: true, message: "Please enter a valid email address." });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        error: true,
        message: "Password must be at least 6 characters long.",
      });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
      return res.status(400).json({
        error: true,
        message: "User already exists.",
      });
    }

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign(
      { user: { _id: user._id, email: user.email, fullName: user.fullName } },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "36000m",
      }
    );

    return res.json({
      error: false,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      message: "Account created successfully.",
      accessToken,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error. Please try again later.",
    });
  }
});

//Login (POST)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        error: true,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        error: true,
        message: "Password is required",
      });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
      return res
        .status(400)
        .json({ error: true, message: "User does not exist." });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, userInfo.password);

    if (userInfo.email === email && isPasswordValid) {
      const user = {
        user: {
          _id: userInfo._id,
          email: userInfo.email,
          fullName: userInfo.fullName,
        },
      };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
      });

      return res.json({
        error: false,
        user: {
          _id: userInfo._id,
          fullName: userInfo.fullName,
          email: userInfo.email,
        },
        message: "Login Successful",
        accessToken,
      });
    } else {
      return res
        .status(400)
        .json({ error: true, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error. Please try again later.",
    });
  }
});

//Get User (GET)
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.json({
    error: false,
    user: {
      _id: isUser._id,
      fullName: isUser.fullName,
      email: isUser.email,
    },
  });
});

//Add Note (POST)
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags, urgency } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is Required" });
  }

  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is Required" });
  }

  if (!urgency) {
    return res
      .status(400)
      .json({ error: true, message: "Urgency is Required" });
  }

  try {
    const note = new Notes({
      title,
      content,
      tags: tags || [],
      urgency,
      userId: user._id, // Use the correct user ID
    });
    await note.save();
    return res.json({ error: false, message: "Note added successfully" });
  } catch (error) {
    console.error("Error saving note:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

//Edit Note (PUT)
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, urgency, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags && !urgency) {
    return res
      .status(400)
      .json({ error: true, message: "No fields to update" });
  }

  try {
    const note = await Notes.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (urgency) note.urgency = urgency;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({ error: false, message: "Note updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

//Get All Notes (GET)
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Notes.find({ userId: user._id }).sort({
      createdOn: -1,
    });

    return res.json({
      error: false,
      notes,
      message: "Notes fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//Delete Note (DELETE)
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Notes.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }
    await Notes.deleteOne({ _id: noteId, userId: user._id });
    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//Update isPinned Value (PUT)
app.put(
  "/update-note-isPinned/:noteId",
  authenticateToken,
  async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
      const note = await Notes.findOne({ _id: noteId, userId: user._id });

      if (!note) {
        return res.status(404).json({ error: true, message: "Note not found" });
      }

      note.isPinned = isPinned;

      await note.save();

      return res.json({
        error: false,
        message: "Pin status updated successfully",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  }
);

//Search API (GET)
app.get("/search-note/", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingNotes = await Notes.find({
      userId: user._id,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });

    return res.json({
      error: false,
      matchingNotes,
      message: "Notes fetched successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

//Pin Note (POST)
app.post("/pin-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Notes.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    note.isPinned = isPinned;
    await note.save();

    return res.json({
      error: false,
      message: isPinned ? "Note pinned" : "Note unpinned",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Catch-all handler for SPA routing (handle frontend routes)
app.get("*", (req, res) => {
  // Only serve this for non-API routes
  if (!req.path.startsWith("/api")) {
    res.status(404).json({
      error: true,
      message: "API endpoint not found. Please check your request URL.",
    });
  }
});

//App Listen
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
