const express = require("express");

const requestRouter = express.Router();
const { userAuth } = require("../../middlewares/auth");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user.id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatuses = ["ignored", "interested"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).send({ error: "Invalid status value" });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send({ error: "User not found!" });
      }

      // if there is an existing connection req
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId, status: { $in: ["interested", "accepted"] } },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
            status: { $in: ["interested", "accepted"] },
          },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ error: "Connection request already exists" });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName + " is " + status + " in connection with " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  },
);

module.exports = requestRouter;
