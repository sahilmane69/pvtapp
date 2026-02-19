const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/login", async (req, res) => {
  try {
    const { phone, role } = req.body;

    if (!phone || !role) {
      return res.status(400).json({ message: "Phone and role are required" });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = new User({ phone, role });
      await user.save();
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
