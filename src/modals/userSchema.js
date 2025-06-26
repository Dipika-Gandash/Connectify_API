const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
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
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address.",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 chracters long"],
      validate: {
        validator(value) {
          return validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1,
          });
        },
        message:
          "Password is not strong enough. It should have at least 8 characters, one uppercase, one lowercase, one number, and one special character.",
      },
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
      default: "Hey there! I'm using this app.",
      maxlength: [300, "Bio cannot be more than 300 characters"],
    },
    photoUrl: {
      type: String,
      default:
        "https://www.macfcu.org/wp-content/uploads/2024/02/Windows_10_Default_Profile_Picture.svg.png",
      validator(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
    skills: {
      type: [String],
      validate: [
        {
          validator(value) {
            return value.length <= 25;
          },
          message: "You can only have a maximum of 25 skills",
        },
        {
          validator(skillArray) {
            return skillArray.every((skill) => skill.length <= 30);
          },
          message: "Each skill should be at most 30 characters long.",
        },
        {
          validator(skillArray) {
            return skillArray.every((skill) => /^[A-Za-z0-9\s]+$/.test(skill));
          },
          message:
            "Skills can only contain alphanumeric characters and spaces.",
        },
      ],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT =  function () {
  const token =  jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );
  return token;
};

userSchema.methods.validatePassword = async function (userPassword) {
  const isPasswordValid = await bcrypt.compare(userPassword, this.password);
  return isPasswordValid;
};
const User = mongoose.model("user", userSchema);

module.exports = User;
