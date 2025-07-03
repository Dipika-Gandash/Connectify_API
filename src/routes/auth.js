const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../modals/userSchema');
const { userAuth } = require('../middlewares/auth');


authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout", userAuth, (req, res) => {
  try{
    res.clearCookie("token");
    res.json({message : "Logged out successfully!"});
  } catch(error){
    return res.status(500).send("Error logging out : " + error.message);
  }
})

module.exports = authRouter;
