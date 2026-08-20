const express = require('express');

const app = express();


// OUTE ORDER MATTERS
// app.use("/user",(req,res) => {
//     res.send('haaaaaaaaaaaaaaaaaaaaa!');
// })

// this will match all the http methods API calls with user path
app.get("/user", (req, res) => {
    res.send({
        name: "Sourabh",
        age: 22
    });
});


app.post("/user", (req, res) => {
    res.send({
        name: "Sourabh",
        age: 22,
        httpMethod: "POST"
    });
});

app.delete("/user", (req, res) => {
    res.send({
        name: "Sourabh",
        age: 22,
        httpMethod: "DELETE"
    });
});

// this will match all the http methods API calls with user path
app.use("/test", (req, res) => {
    res.send('test from test!');
});





// app.use("/", (req, res) => {
//     res.send('Welcome /!');
// });


app.listen(3000, () => {
  console.log('Server is running on localhost:3000');
});