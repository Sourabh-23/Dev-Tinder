const express = require('express');

const app = express();

app.use("/test", (req, res) => {
    res.send('test from Express server!');
});


app.use("/hello", (req, res) => {
    res.send('Hello World!g');
});


app.use("/", (req, res) => {
    res.send('Welcome to the Express !');
});
app.listen(3000, () => {
  console.log('Server is running on localhost:3000');
});