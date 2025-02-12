const mongoose = require("mongoose");

const allReportsSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Anonymous", // Always set as Anonymous
  },
  email: {
    type: String,
  },
  userPhoto: {
    type: String,
  },
  phone_number: {
    type: Number,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  district: {
    type: String,
  },
  division: {
    type: String,
  },
  location: {
    type: String,
  },
  crime_time: {
    type: String,
  },
  posted_time: {
    type: String,
    default: () => {
      const currentDateTime = new Date();
      const formattedDate = currentDateTime.toLocaleString(); // Format the date and time
      return formattedDate;
    },
  },
  position_details: {
    type: String,
  },
  photo_url: {
    type: String,
    default: null, // Optional: Link to an image as evidence
  },
  video_url: {
    type: String,
    default: null, // Optional: Link to a video as evidence
  },
  category: {
    type: String,
    enum: [
      "Bribery",
      "Fraud",
      "Misuse of Funds",
      "Political Corruption",
      "Other",
    ],
  },
  verification_status: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending", // Status of the report verification
  },
  report_status: {
    type: String,
    enum: ["Open", "Under Investigation", "Closed"],
    default: "Open", // Current investigation status
  },
});

const AllReports = mongoose.model("AllReports", allReportsSchema);

module.exports = AllReports;
