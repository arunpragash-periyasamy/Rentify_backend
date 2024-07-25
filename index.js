const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); 
const mongoose = require("mongoose");
const dbConnection = require("./db/conn");
const handleFileUpload = require("./utils/fileUploads");
require("dotenv").config();

// Routes
const authRoute = require("./Routes/auth");
const houseRoute = require("./Routes/house");

dbConnection();
const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/house", houseRoute);


const keyMappings = {
  images: 'images',
};

app.get('/test/:fileName', (req, res) => {
  res.send("testing")
});

// app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello from Rentify backend");
})

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("Listening to the port ", PORT);
})