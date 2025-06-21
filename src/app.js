const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const User = require("./modals/userSchema");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, age, gender, bio } = req.body;
  try {
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      bio,
    });

    await user.save();
    res.send("User created successfuly");
  } catch (error) {
    res.status(500).send("Error creating user : " + error.message);
  }
});

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
