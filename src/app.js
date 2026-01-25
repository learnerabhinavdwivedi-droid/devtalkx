const express = require('express');
const app = express();


// Home route
app.get("/", (req, res) => {
    res.send("Welcome to the home page");
});

// Hello route
app.get("/hello", (req, res) => {
    res.send("Hello from /hello route");
});

// Test route
app.get("/test", (req, res) => {
    res.send("Hello World");
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
