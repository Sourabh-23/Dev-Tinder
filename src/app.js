const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');
const requestRouter = require('./routes/request');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');



app.use(express.json());
app.use(cookieParser());

app.use('/', requestRouter);
app.use('/', authRouter);
app.use('/', profileRouter);


connectDB()
    .then(() => {
        console.log("Database connected successfully -");
        app.listen(7777, () => {
            console.log("Server is running on port 7777");
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected", err);
    });
