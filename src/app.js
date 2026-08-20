const express = require('express');
const app = express();

app.get("/user/:userid", (req, res) => {
    console.log(req.params);
    res.send({
        name: "Sourabh",
        age: 22
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
