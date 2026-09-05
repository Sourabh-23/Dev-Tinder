const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        required: true,
       enum:{
           values: ["ignored", "interested", "accepted", "rejected"],
           message: '{VALUE} is not supported'
       }
    }
}, {
    timestamps: true
});

// connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });


connectionRequestSchema.pre('save', async function(next) {
    const connectionRequest = this;
    // check if the from user and to user are the same
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send a connection request to yourself");
    }
    next();
});

const ConnectionRequestModel =  new mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequestModel;