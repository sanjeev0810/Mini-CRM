const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth"); // Ensure this middleware is imported

// ✅ REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json("User already exists");

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    res.json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    res.status(500).json("Error creating user");
  }
});

// ✅ LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json("Wrong password");

    const token = jwt.sign(
      { id: user._id, name: user.name }, 
      process.env.JWT_SECRET, 
      { expiresIn: "24h" }
    );

    res.json({ 
      token, 
      user: { name: user.name, email: user.email } 
    });
  } catch (err) {
    res.status(500).json("Server error during login");
  }
});

// ✅ GET USERS ROUTE (Added this to fix your 404 error)
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({}, "name _id"); 
    res.json(users);
  } catch (err) {
    res.status(500).json("Error fetching users");
  }
});

module.exports = router;