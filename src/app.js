const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignupData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require("../middlewares/auth");



app.use(express.json());
app.use(cookieParser());




app.post("/signup", async (req, res) => {

    try {
        validateSignupData(req);

        const { firstName, lastName, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);  //1

        const user = new User({ //2
            firstName,
            lastName,
            email,
            password: passwordHash
        });

        await user.save();
        res.send("User created successfully");
    } catch (err) {
        res.status(400).send("User cannot be created : " + err.message);
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
      //  console.log(user);
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("Update failed " + err.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body; //3

        const user = await User.findOne({ email });   
        if (!user) {
            return res.status(404).send("Invalid Credentials");
        }

        const isPasswordValid = await user.validatePassword(password);  //4
        
        if (isPasswordValid) {

        const token = await user.getJwt();  //6
     

        //8
          res.cookie("token", token, { 
            expires: new Date(Date.now() + 8 * 3600000), // 8 hours
         });
          res.send("Login successful");
        } else {
            res.status(404).send("Invalid Credentials");
        }
    } catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
}); 

app.get("/profile",userAuth, async (req, res) => {
 try{ 
  const user = req.user;
   console.log(`User from profile route: ${user}`);

res.send(user);
}catch(err){
    res.status(400).send("Something went wrong " + err.message);
}
});

app.post("/sendConnectionRequest",userAuth, async (req, res) => {

const user = req.user;

    console.log("Sending connection request from app.js route");

    res.send(user.firstName + " " + user.lastName + " sent a connection request to ");


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
