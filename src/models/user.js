// Import Mongoose
const mongoose = require("mongoose");

// Define the schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    unique: true, // Email must be unique
    lowercase: true, // Automatically converts the string to lowercase
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
    min: 0, // Minimum value
    max: 120, // Maximum value
  },
  gender: {
    type: String,
  },
});

// Create a model from the schema
const User = mongoose.model("User", userSchema);

// Export the model
module.exports = User;
