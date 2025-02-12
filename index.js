const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

// all ai implementation
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const axios = require('axios')

// middleware
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;


// mongoose (2)
const mongoose = require("mongoose");
let mongo_url = process.env.MONGO_URL;
main()
  .then(() => {
    console.log("mongodb is connected");
  })
  .catch((error) => {
    console.log(error);
  });
async function main() {
  await mongoose.connect(mongo_url);
}


// mongoose schema import
let UserData = require("./models/UserData.js");
let AllReports = require("./models/allReports.js");
let SuccessReports = require("./models/SuccessReports.js");

app.get('/',(req,res)=>{
    res.send("this is a root route");
})


app.listen(port, ()=>{
    console.log(`port ${port} is listening`);
})