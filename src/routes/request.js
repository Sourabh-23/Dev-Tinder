const express = require('express');

const requestRouter = express.Router();
const { userAuth } = require("../../middlewares/auth");
const User = require('../models/user');

requestRouter.post("/sendConnectionRequest",userAuth, async (req, res) => {

const user = req.user;

    console.log("Sending connection request from app.js route");

    res.send(user.firstName + " " + user.lastName + " sent a connection request to ");


});

module.exports = requestRouter;
