const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // match: /^[a-zA-Z0-9_]{3,15}$/,
  },
  email: {
    type: String,
    required: true,
    // match: /^\S+@\S+\.\S+$/,
  },
  password: {
    type: String,
    required: true,
    // minlength: 6,
  },
});

module.exports = mongoose.model("User", userSchema);
