const express = require('express');
const app = express();


const {adminAuth,userAuth} = require("./middlewares/auth");
app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
    res.send("User data");
});

app.get("/admin/getalldata", adminAuth, (req, res) => {
    res.send("All admin data");
});
app.get("/admin/deletedata", adminAuth, (req, res) => {
    res.send("Admin deleted data");
});
app.get("/user", (req, res)=> {
    res.send("User route handler");
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});