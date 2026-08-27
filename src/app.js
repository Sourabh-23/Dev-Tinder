const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
app.use(express.json());




app.post("/signup",async (req,res)=>{
const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    age: req.body.age   
});


try{
    await user.save()
    res.send("User created successfully");
}catch(e){
    res.status(400).send("User cannot be created : " + e.message);    
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
