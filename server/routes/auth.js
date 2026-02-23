const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");

const ADMIN_USERNAME = "sahilmane69";
const ADMIN_PASSWORD = "mh14jt4266";

async function ensureAdminSeeded() {
  const admin = await User.findOne({ username: ADMIN_USERNAME });
  if (!admin) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({
      username: ADMIN_USERNAME,
      passwordHash: hash,
      role: "admin",
      phone: "",
    });
  }
}

// Register normal user
router.post("/register", async (req, res) => {
  console.log("POST /auth/register - Body:", req.body);
  try {
    const { username, password, phone } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      passwordHash,
      phone: phone || "",
      role: null,
    });

    res.status(201).json({
      message: "Account created",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login user (including admin)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    await ensureAdminSeeded();

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Set role (farmer or delivery) after login
router.post("/set-role", async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !["farmer", "delivery", "customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid user or role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Role updated",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
