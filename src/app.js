const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
app.use(express.json());




app.post("/signup",async (req,res)=>{
    console.log("Request body : ", req.body);
// const user = new User({
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     password: req.body.password,
//     age: req.body.age    
// });

const user = new User(req.body);

try{
    await user.save()
    res.send("User created successfully");
}catch(e){
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
// Update data of the user
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
   
    
    try {
        await User.findByIdAndUpdate({ _id: userId }, data );
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("Something went wrong " + err.message);
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
