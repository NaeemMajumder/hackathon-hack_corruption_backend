const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");


// all ai implementation
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json());
app.use(cors());

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

// user latest post
app.get('/latestPosts', async(req,res)=>{
  const email = req.query.email;
  const user = await UserData.findOne({ email: email }).populate({path: "posts",options: { sort: { _id: -1 }, limit: 3 }, });
  const userLatestPost = user?.posts;

  const userPosts = await UserData.findOne({ email: email }).populate({path: "posts",options: { sort: { _id: -1 }}, });
  const totalPosts = userPosts?.posts.length;
  
  res.send({userLatestPost,totalPosts})

})

app.put("/admin/allUsers/:id", async (req, res) => {
  let id = req.params.id;
  let updateData = await UserData.findByIdAndUpdate(id, {
    idBan: req.body.isBan,
  });
  res.send(updateData);
});

app.get("/admin/allUsers/:id", async (req, res) => {
  let id = req.params.id;
  console.log(id);
  let userData = await UserData.findById(id);
  res.send(userData);
});

// public corruption report post
app.get("/allReports", async (req, res) => {
  let allReports = await AllReports.find({}).sort({ createdAt: -1 }); // Sorting by createdAt in descending order
  res.send(allReports);
});

// // create post
// app.post("/createPost", async (req, res) => {
//   let postData = req.body;
//   console.log(postData);
//   let newPost = {};

//   if (postData.phoneNumber) {
//     newPost = {
//       name: postData.name,
//       email: postData.email,
//       phone_number: postData.phoneNumber,
//       userPhoto: postData.userPhoto,
//       title: postData.title,
//       description: postData.description,
//       district: postData.district,
//       division: postData.division,
//       location: postData.location,
//       crime_time: postData.crimeTime,
//       photo_url: postData.imageUrl,
//       video_url: postData?.video_url,
//       category: postData.category,
//     };
//   } else {
//     newPost = {
//       title: postData.title,
//       description: postData.description,
//       district: postData.district,
//       division: postData.division,
//       location: postData.location,
//       crime_time: postData.crimeTime,
//       photo_url: postData.imageUrl,
//       video_url: postData?.videoUrl,
//       category: postData.category,
//     };
//   }

//   const user = await UserData.findOne({ email: req.query.email });

//   let newPostedData = new AllReports(newPost);
//   let result = await newPostedData.save();
//   user.posts.push(result?._id);
//   await user.save();
//   res.send("result");
// });

async function postReport(title, description, imageDescription) {
    const url = 'https://mahmudur.app.n8n.cloud/webhook/4420ecc1-4b93-42a9-a8ba-613059e499bb';
    const formData = new URLSearchParams();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image_description', imageDescription);
   
    try {
      const { data } = await axios.post(url, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      console.log(data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
   
  // Example usage
  // postReport('Example Title', 'Example Description', 'Example Image Description');

app.post("/createPost", async (req, res) => {
    try {
      let postData = req.body;
      console.log(postData);
      let newPost = {};
  
      if (postData.phoneNumber) {
        newPost = {
          name: postData.name,
          email: postData.email,
          phone_number: postData.phoneNumber,
          userPhoto: postData.userPhoto,
          title: postData.title,
          description: postData.description,
          district: postData.district,
          division: postData.division,
          location: postData.location,
          crime_time: postData.crimeTime,
          photo_url: postData.imageUrl, // Store the processed image URL
          video_url: postData?.video_url,
          category: postData.category,
        };
      } else {
        newPost = {
          title: postData.title,
          description: postData.description,
          district: postData.district,
          division: postData.division,
          location: postData.location,
          crime_time: postData.crimeTime,
          photo_url: postData.imageUrl, // Store the processed image URL
          video_url: postData?.videoUrl,
          category: postData.category,
        };
      }
  
      // Download, Resize, and Add Watermark
      const processedImagePath = await processImage(postData.imageUrl);
  
      // Update the stored image URL with the processed one
      newPost.photo_url = processedImagePath;

  
      const user = await UserData.findOne({ email: req.query.email });
  
      let newPostedData = new AllReports(newPost);

      try{

        await postReport(newPost.title, newPost.description, " ")

      }catch(error){
        console.log(error)
      }



      let result = await newPostedData.save();
      user.posts.push(result?._id);
      await user.save();
  
      res.send({ message: "Post created successfully!", imageUrl: processedImagePath });
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).send("Error processing image");
    }
  });
  
  /**
   * Function to download, resize, and add watermark to an image
   */
  async function processImage(imageUrl) {
    try {
      // Download the image
      const response = await axios({
        url: imageUrl,
        responseType: "arraybuffer",
      });
  
      const imageBuffer = Buffer.from(response.data, "binary");
  
      // Define output path
      const outputPath = path.join(__dirname, "uploads", `processed_${Date.now()}.jpg`);
  
      // Watermark text image
      const watermarkText = path.join(__dirname, "bd-logo.png");
  
      // Process image: Resize & Add Watermark
      const processedImage = await sharp(imageBuffer)
        .resize({ width: 800 }) // Resize while maintaining aspect ratio
        .composite([{ input: watermarkText, gravity: "southeast", blend:'overlay' }]) // Add watermark at the bottom
        .toFile(outputPath);
  
      return outputPath;
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  }

app.get("/myPosts", async (req, res) => {
  let email = req.query.email;
  const user = await UserData.findOne({ email: email }).populate("posts");
  const userPosts = user.posts.sort(
    (a, b) => new Date(b.posted_time) - new Date(a.posted_time)
  ); // Sort posts by posted_time in descending order
  res.send(userPosts);
});

app.put("/allReports/:id", async (req, res) => {
  let id = req.params.id;
  let updatedData = req.body;

  let result = await AllReports.findByIdAndUpdate(id, updatedData);

  res.send(result);
});







// user role find
app.get('/userRole', async(req,res)=>{
  const email = req.query.email;
  const userRole = await UserData.findOne({ email }).select("role");
  console.log(userRole);
  res.send(userRole?.role)
})



// show details data
app.get("/posts/:id", async (req, res) => {
  let id = req.params.id;
  let data = await AllReports.findById(id);
  res.send(data);
});

// update post either it is verified or rejected
app.put("/posts/:id", async (req, res) => {
  let id = req.params.id;
  let updatedData = await AllReports.findByIdAndUpdate(id, {
    verification_status: req.body.verification_status,
  });
  console.log(updatedData);
  res.send(updatedData);
});

// home page recent report data
app.get("/home/allReports", async (req, res) => {
  let allReports = await AllReports.find({}).sort({ posted_time: -1 }).limit(4);
  res.send(allReports);
});

// home page success story report data
app.get("/home/successReports", async (req, res) => {
  let successReports = await SuccessReports.find({}).sort({ posted_date: -1 }).limit(4); 
  res.send(successReports);
});

// // see user data
// app.get("/userReports", async (req, res) => {
//   let email = req.query.email;
//   const user = await UserData.findOne({ email: email }).populate("posts");

//   let result = user.posts;
//   res.send(result);
// });

// success report get
app.get("/successReport", async (req, res) => {
  let allSuccessReports = await SuccessReports.find({}).sort({
    posted_time: -1,
  });
  res.send(allSuccessReports);
});

app.get("/successReport/:id", async(req,res)=>{
  let id = req.params.id;
  let result = await SuccessReports.findById(id);
  res.send(result);
})

app.post("/successReport", async (req, res) => {
  let successReportPost = req.body;
  console.log(successReportPost);

  let newSuccessPost = new SuccessReports(successReportPost);
  let result = await newSuccessPost.save();

  res.send(result);
});

app.put("/successReport/:id", async(req,res)=>{
  let id = req.params.id;
  let updatedData = req.body;

  let result = await SuccessReports.findByIdAndUpdate(id, updatedData);

  res.send(result);
})






// ai test 

app.get('/testAi', async(req,res)=>{
  const prompt = "do you know chat gpt";

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  res.send({answer:"working" })
})

app.get("/aiGenerateText", async(req,res)=>{
    console.log("backend working")
  const imageUrl = req.query.imgUrl;

  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  // console.log(response.data);

  // const responseData = response.data;
  const responseData = {
    inlineData: {
      data: Buffer.from(response.data).toString('base64'),
      mimeType: "image/png",
    }
  };

  const result = await model.generateContent(["Analyze the uploaded image and generate a detailed, factual description related to corruption, such as bribery, fraud, misuse of power, or unethical activities. Clearly describe the scene, actions, and any visible evidence while maintaining accuracy and neutrality. Avoid speculation, personal identifiers, or phrases like 'this image is about.' If the image is unrelated to corruption or contains inappropriate content, respond with: 'This image does not appear to be related to corruption. Please upload a relevant image.'", responseData])
  const generatedAiData = result.response.text();
  console.log(generatedAiData);
  res.send(generatedAiData);
});


app.listen(port, (req, res) => {
  console.log(`port ${port} is listening`);
});
