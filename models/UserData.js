const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  photoUrl: {
    type: String,
  },
  phone: {
    type: String,
  },
  idType: {
    type: String,
  },
  idNumber: {
    type: String,
  },
  identify_method_photoUrl: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AllReports", // Refers to the Post model
    },
  ],
  isBan: {
    type: Boolean,
    default: false, // Initially, the user is not banned
  },
  bio:{
    type:String,
  }
});

const UserData = mongoose.model("UserData", userDataSchema);

module.exports = UserData;
