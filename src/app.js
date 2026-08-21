const express = require("express");

const app = express();



app.get("/getuserdata", (req, res) => {

    
    throw new Error("Error in getuserdata route");
    res.send("User data received");
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send("Something went wrong!");      
});
 
app.listen(7777, () => {
    console.log("Server started at port 7777");
});