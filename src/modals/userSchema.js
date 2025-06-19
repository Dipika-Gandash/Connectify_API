const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minlength: [2, "First name must be at least 2 character"],
    maxlength: [30, "First name must be at most 30 character"],
  },
  lastName: {
    type: String,
    trim: true,
    minlength: [2, "Last name must be at least 2 characters long"],
    maxlength: [30, "Last name must be at most 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 chracters long"],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "Password must have at least one uppercase, one lowercase, one number, and one special character",
    ],
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
    min: [18, "Age must be at least 18"],
    max: [99, "Age must be at most 99"],
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female", "other"],
      message: "Gender must be either male, female, or other",
    },
    lowercase: true,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [300, 'Bio cannot be more than 300 characters']
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
