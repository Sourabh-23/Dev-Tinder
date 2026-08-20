const express = require('express');
const app = express();

app.use("/users", 
    (req, res, next) => {
        console.log("Request received at /users - Handler 1");
        next();
    },
    (req, res, next) => {
        console.log("Request received at /users - Handler 2");
       // res.send("Hello from /users - Handler 2!"); // ← yahan response bhejo
        next();
    },
    (req, res, next) => {
        console.log("Request received at /users - Handler 3");
       // res.send("Hello from /users - Handler 3!");
        next();
    },
    (req, res, next) => {
        console.log("Request received at /users - Handler 4");
       // res.send("Hello from /users - Handler 4!"); // ← yahan response bhejo
        next(); // ← ye add karo, taaki agle handler tak pahunche
    },
    (req, res) => {                          // ← 5th handler — naya add kiya
        console.log("Request received at /users - Handler 5 (Final)");
        res.send("Hello from /users - Final Response!"); // ← yahan response bhejo
    }
);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});