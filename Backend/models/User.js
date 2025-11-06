import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, unique: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  age: { type: Number, min: 1, max: 120, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  prescriptionUrl: { type: String, default: null },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
