const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in the .env file');
    }

    await mongoose.connect(MONGODB_URI);
};



module.exports = connectDB;