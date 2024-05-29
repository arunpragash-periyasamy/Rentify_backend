const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); 
const mongoose = require("mongoose");
const authRoute = require("./Routes/auth");
const dbConnection = require("./db/conn");
require("dotenv").config();

dbConnection();
const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRoute);





// app.use(bodyParser.json());

app.get("/", (req, res) => {
    console.log()
    res.send("Hello from Rentify backend");
})

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("Listening to the port ", PORT);
})