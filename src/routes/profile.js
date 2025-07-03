const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

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

module.exports = profileRouter;
