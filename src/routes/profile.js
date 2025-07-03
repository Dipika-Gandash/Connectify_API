const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const { User } = require("../modals/userSchema")
const validator = require("validator");
const bcrypt = require("bcrypt");

profileRouter.get("/profile", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid update data");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      if (key !== "id" && key !== "_id" && key !== "password") {
        loggedInUser[key] = req.body[key];
      }
    });

    await loggedInUser.save();
    res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res.status(500).send("Error updating profile: " + error.message);
  }
});

profileRouter.patch("/profile/update/password", userAuth, async (req, res) => {
  try{
    const { oldPassword, newPassword }= req.body;
    const loggedInUser = req.user;

    if( !oldPassword || !newPassword){
      return res.status(400).send("Old password and new password are required");
    }


    const isOldPasswordValid = await loggedInUser.validatePassword(oldPassword);

    if(!isOldPasswordValid){
      return res.status(400).send("You old Password is incorrect");
    }

    if(oldPassword === newPassword){
      return res.status(400).send("New password cannot be the same as old password");
    }

      if (!validator.isStrongPassword(newPassword, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })) {
      return res.status(400).send("New password is not strong enough. It must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
    }


    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = newPasswordHash;
    await loggedInUser.save();

    res.status(200).json({
      message : "Password updated successfully",
    })



  }catch(error){
    return res.status(500).send(error.message);
  }
})
module.exports = profileRouter;
