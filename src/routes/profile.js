const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../../middlewares/auth");
const User = require("../models/user");
const { validateProfileEditData } = require("../utils/validation");

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




module.exports = profileRouter;
