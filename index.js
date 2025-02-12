const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

// all ai implementation
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const axios = require("axios");

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

app.get("/", (req, res) => {
  res.send("this is a root route");
});

// user route
app.get("/users", async (req, res) => {
  let allUsers = await UserData.find({});
  res.send(allUsers);
});

app.post("/users", async (req, res) => {
  let data = req.body;
  let userData = {
    username: data.username,
    email: data.email,
    photoUrl: data.profileImage,
    phone: data.phone,
    idType: data.idType,
    idNumber: data.idNumber,
    identify_method_photoUrl: data.idImage,
  };
  let newUser = new UserData(userData);
  let result = await newUser.save();
  res.send(result);
});

// individual user data for dashboard
app.get("/userData", async (req, res) => {
  let email = req.query.email;

  let userData = await UserData.findOne({ email: email });
  res.send(userData);
});

// update user data
app.put("/userData", async (req, res) => {
    let email = req.query.email;
    console.log(email);
  
    let userData = req.body;
  
    let updatedData = {
      username:userData.name,
      email,
      bio:userData.bio,
      phone: userData.phone_number,
      photoUrl: userData.profilePicture,
    };
  
    // Update the user document in the database
    const updatedUser = await UserData.findOneAndUpdate(
      { email: email },
      { $set: updatedData }, 
      { new: true } 
    );
  
    res.send(updatedData);
  });
  














app.listen(port, () => {
  console.log(`port ${port} is listening`);
});
