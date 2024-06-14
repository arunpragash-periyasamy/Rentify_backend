const app = require("express").Router();
const { signup, login } = require("../Controllers/auth");

app.post("/signup", signup);
app.post("/login", login);
app.post("/test", (req, res) => {
    console.log(res.cookies)
    res.send("success");
})
module.exports = app;