const mongoose = require("mongoose");

const successReportsSchema = new mongoose.Schema(
  {
    title: {
      type: String, // username or anonemous
    },
    reported_by: {
      type: String, // username or anonemous
    },
    case_url: {
      type: String, // user post url
    },
    case_photo: {
      type: String, // user post url
    },
    category: {
      type: String, 
    },
    location: {
      type: String,
    },
    date_reported: {
      type: Date,
    },
    posted_date: {
      type: String,
      default: () => {
        const currentDateTime = new Date();
        const formattedDate = currentDateTime.toLocaleString(); // Format the date and time
        return formattedDate;
      },
    },
    actions_taken: {
      type: String, // Changed to string to allow text input
    },
    date_resolved: {
      type: Date,
    },
    message: {
      type: String,
    },
  },
);

// Create a model from the schema
const SuccessReport = mongoose.model("SuccessReport", successReportsSchema);

module.exports = SuccessReport;
