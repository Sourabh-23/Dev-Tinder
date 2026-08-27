const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sourabhhowale_db_user:NamasteNode123@cluster0.iuhasst.mongodb.net/namaste-node?appName=Cluster0';

const connectDB = async () => {
    await mongoose.connect(MONGODB_URI);
};



module.exports = connectDB;