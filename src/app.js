const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const User = require("./modals/userSchema");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth")


app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, age, gender, bio, skills } =
    req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      gender,
      bio,
      skills,
    });

    await user.save();
    res.send("User created successfuly");
  } catch (error) {
    res.status(500).send("Error creating user : " + error.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials!");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).send("Incorrect Password");
    }

    const token = user.getJWT();
    res.cookie("token", token, { httpOnly: true });
    const { firstName, lastName, bio } = user;
    res.json({
      message: "Login Successful!",
      firstName,
      lastName,
      bio,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

app.get("/profile", userAuth,  async (req, res) => {
  
  try {
    const user = req.user;
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      bio: user.bio,
    });
  } catch (error) {
    return res.status(500).send("Error fetching profile :" + error.message);
  }
});

app.get("/logout", userAuth, (req, res) => {
  try{
    res.clearCookie("token");
    res.json({message : "Logged out successfully!"});
  } catch(error){
    return res.status(500).send("Error logging out : " + error.message);
  }
})





connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Database connection failed :", error.message);
  });
