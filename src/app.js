const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignupData } = require('./utils/validation');
const bcrypt = require('bcrypt');


app.use(express.json());




app.post("/signup", async (req, res) => {
    console.log("Request body : ", req.body);

    try {
        validateSignupData(req);

        const { firstName, lastName, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });

        await user.save();
        res.send("User created successfully");
    } catch (e) {
        res.status(400).send("User cannot be created : " + e.message);
    }
});

app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    try {
        const user = await User.find({ email: userEmail });
        if (user.length === 0) {
            return res.status(404).send("No users found with the provided email");
        }else{
             res.send(user);
        }
       
    } catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
});

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {     
        res.status(400).send("Something went wrong " + err.message);
    }
});

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const result = await User.findByIdAndDelete({ _id: userId });
        if (!result) {
            return res.status(404).send("No user found with the provided ID ");
        }
        res.send("User deleted successfully");
    } catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
});

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;
    try {
         const  ALLOWED_UPDAT =[
        "photourl",
        "about",
        "skills",
        "age"
    ]
   const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDAT.includes(key));
    if (!isUpdateAllowed) {
       throw new Error("Invalid updates!");
    }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "after",
            runValidators: true,
        });
        console.log(user);
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("Update failed " + err.message);
    }
});


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
