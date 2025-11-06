import User from "../models/User.js";
import jwt from "jsonwebtoken";

// JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// REGISTER
export const registerUser = async (req, res) => {
  try {
    let { username, email, gender, age, phone, password } = req.body;

    if(!username || !email || !gender || !age || !phone || !password)
      return res.status(400).json({ message: "All fields are required" });

    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if(existingUser) 
      return res.status(400).json({ message: "Email already registered" });

    // ❌ Don't hash password manually, model will do it
    const user = await User.create({ username, email, gender, age, phone, password });

    const token = generateToken(user._id);

    res.status(201).json({ message:"User registered", user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:"Server error" });
  }
}

// LOGIN
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    // Compare password correctly
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        age: user.age,
        phone: user.phone,
        prescriptionUrl: user.prescriptionUrl,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
//profile
export const getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });
    console.log("📝 getProfile called for user:", req.user);
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




