// Import Mongoose
const mongoose = require("mongoose");
const validator = require("validator"); // Import validator package

// Define the schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return validator.isAlpha(v.replace(/\s/g, ""));
        },
        message: "First name must contain only letters and spaces",
      },
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return validator.isAlpha(v.replace(/\s/g, ""));
        },
        message: "Last name must contain only letters and spaces",
      },
    },
    emailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return validator.isEmail(v);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      validate: {
        validator: function (v) {
          // Check if password is strong using isStrongPassword
          return validator.isStrongPassword(v, {
            minLength: 8, // Minimum 8 characters
            minLowercase: 1, // At least 1 lowercase letter
            minUppercase: 1, // At least 1 uppercase letter
            minNumbers: 1, // At least 1 number
            minSymbols: 1, // At least 1 symbol (e.g., !, @, #)
            returnScore: false, // Don't return the score, just validate
          });
        },
        message:
          "Password must be at least 8 characters long, contain a mix of uppercase, lowercase, numbers, and symbols.",
      },
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [15, "Age must be at least 15 years."],
      max: [55, "Age must not exceed 55 years."],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      trim: true,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be one of 'male', 'female', or 'other'",
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://hoffice1.ondemandcrm.co/public/images/ecommerce/productnotfound.png",
      validate: {
        validator: function (v) {
          // Use validator.isURL to validate the URL
          return validator.isURL(v, {
            protocols: ["http", "https"], // Ensures URL uses http or https
            require_protocol: true, // Ensures the URL includes the protocol (http:// or https://)
          });
        },
        message: "Invalid photo URL format", // Custom error message
      },
    },
    about: {
      type: String,
      default: "This is a default about section",
      validate: {
        validator: function (v) {
          return validator.isAlpha(v.replace(/\s/g, ""));
        },
        message: "About must contain only letters and spaces",
      },
    },
    skills: {
      type: [String], // Array of strings
      validate: [
        {
          validator: function (v) {
            // Ensure `skills` is an array
            return Array.isArray(v);
          },
          message: "Skills must be an array of strings.",
        },
        {
          validator: function (v) {
            // Ensure every item in the array is a string
            return v.every((skill) => typeof skill === "string");
          },
          message: "Each skill in the array must be a string.",
        },
        {
          validator: function (v) {
            // Ensure there are no more than 5 skills
            return v.length <= 5;
          },
          message: "You can only add up to 5 skills.",
        },
      ],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create a model from the schema
const User = mongoose.model("User", userSchema);

// Export the model
module.exports = User;
