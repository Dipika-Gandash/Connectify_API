const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const User = require("./modals/userSchema");
const app = express();
const bcrypt = require('bcrypt');

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, age, gender, bio, skills } =
    req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password : hashedPassword,
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

app.post("/login", async(req, res) => {
  const {email, password} = req.body;

  try{
   const user = await User.findOne({email : email});
   if(!user){
   throw new Error("Invalid credentials!");
   }

   const isPasswordValid = await bcrypt.compare(password, user.password);
   if(!isPasswordValid){
    return res.status(401).send("Incorrect Password");
   }

   const {firstName, lastName, bio} = user;
   res.json({
    message : "Login Successful!",
    firstName, 
    lastName, 
    bio
   })

  } catch(error){
    return res.status(400).send(error.message);
  }
})

app.get("/user", async (req, res) => {
  const email = req.query.email;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.send("User not found");
    }
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      bio: user.bio,
    });
  } catch (error) {
    res.status(500).send("Error fetching user : " + error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}, "firstName lastName age bio");
    if (users.length === 0) {
      return res.send("No users found");
    }
    res.json(users);
  } catch (error) {
    res.status(500).send("Error fetching feed : " + error.message);
  }
});

app.patch("/updateProfile/:id", async (req, res) => {
  const userId = req.params.id;
  const data = req.body;

  const ALLOWED_UPDATES = ["firstName", "lastName", "photoUrl", "bio", "skills"];
 

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key))
   if(!isUpdateAllowed){
    return res.status(400).send("Invalid Updation of Data");
   }
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      runValidators: true,
      new: true,
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});



app.delete("/deleteProfile", async (req, res) => {
  const email = req.query.email;
  try {
    const user = await User.findOneAndDelete(email);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (error) {
    return res.status(500).send("Error deleting user : " + error.message);
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
