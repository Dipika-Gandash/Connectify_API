const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const User = require("./modals/userSchema");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, age, gender, bio, skills } = req.body;
  try {
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      bio,
      skills
    });

    await user.save();
    res.send("User created successfuly");
  } catch (error) {
    res.status(500).send("Error creating user : " + error.message);
  }
});

app.get("/user", async (req, res) => {
  const email = req.query.email;
  try{
    const user = await User.findOne({ email : email});
    if(!user) {
      return res.send("User not found");
    }
    res.json({
      firstName: user.firstName,
      lastName : user.lastName,
      email : user.email,
      age : user.age,
      bio : user.bio
    })
  }
  catch(error){
    res.status(500).send("Error fetching user : " + error.message);
  }
})

app.get("/feed", async (req, res) => {
  try{
    const users = await User.find({}, 'firstName lastName age bio');
    if(users.length === 0){
      return res.send("No users found");
    }
    res.json(users);

  } catch(error){
    res.status(500).send("Error fetching feed : " + error.message);
  }
})

app.patch("/updateProfile", async (req, res) => {
  const id = req.query.id;
  try{
   const user = await User.findById(id);
   if(!user){
    return res.status(404).send("User not found");
   }

  const updatedUser = await User.findByIdAndUpdate(id, req.body, { new : true});
    res.json({
      message: "profile updated successfully",
      user : updatedUser
    })
  } catch(error){
    
  }
})

app.delete("/deleteProfile", async (req, res) => {
  const email = req.query.email;
  try {
    const user = await User.findOneAndDelete(email);
    if(!user){
     return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch(error){
    return res.status(500).send("Error deleting user : " + error.message);
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
