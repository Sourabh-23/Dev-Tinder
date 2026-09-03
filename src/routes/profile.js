const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../../middlewares/auth");
const User = require("../models/user");
const { validateProfileEditData } = require("../utils/validation");
const bcrypt = require('bcrypt');
const validator = require('validator');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(`User from profile route: ${user}`);

    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateProfileEditData(req);

    const loggedInuser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInuser[key] = req.body[key];
    });

    await loggedInuser.save();

    console.log(`loggedInuser: ${loggedInuser}`);
    res.send({ message: "Profile updated successfully", user: loggedInuser });
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            throw new Error("Current password and new password are required");
        }

        const loggedInUser = req.user;

        // Step 1: purana password verify karo
        const isPasswordValid = await loggedInUser.validatePassword(currentPassword);
        if (!isPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        // Step 2: naya password strong hona chahiye
        if (!validator.isStrongPassword(newPassword)) {
            throw new Error("New password is not strong enough");
        }

        // Step 3: hash karke save karo
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = newPasswordHash;
        await loggedInUser.save();

        // Step 4: security best practice - password change hone pe cookie clear karo,
        // taaki user dobara login kare naye password se
        res.clearCookie("token");

        res.send("Password changed successfully. Please login again");
    } catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
});

module.exports = profileRouter;
