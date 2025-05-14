const mongoose = require("mongoose");

const check = mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String
})

// const contactSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     minlength: 10,
//   },
//   email: {
//     type: String,
//     required: true,
//     match: /^\S+@\S+\.\S+$/,
//   },
//   subject: {
//     type: String,
//     required: true,
//     minlength: 30,
//   },
//   message: {
//     type: String,
//     required: true,
//     minlength: 30,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

module.exports = mongoose.model("Contacts",check );
