require("dotenv").config();
const express = require ("express");
const path = require("path");
const dbConnect = require("./connection/Mongodb.js");
const router = require("./Router/userRouter.js");
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// EJS setup ✅
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // IMPORTANT

dbConnect()

app.use("/",router)


app.listen(process.env.PORT || 3000,()=>{
    console.log("server Running");   
})