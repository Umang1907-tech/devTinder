const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const validateSignupData = require("./utils/validation");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Secret key for JWT (you should use a secure key in production)
const JWT_SECRET_KEY = "XhJ8gq2K!dG@F9VgTzY0yJmA^iB5@4L2pXw7"; // Replace with your secure key
// Middleware to parse JSON request body
app.use(express.json());
// const { adminAuth, userAuth } = require("./middlewares/auth");
// console.log(adminAuth, "adminAuth..")

// app.use("/hello/2", (req, res) => {
//   res.send("abara ka dabra");
// });

// app.use("/dashboard", (req, res) => {
//   res.send("Hello from dashboard");
// });

// app.use("/user", (req, res) => {
//   res.send("ha ha ha ha..");
// });

// app.post("/user", (req, res) => {
//   res.send("Save Data successfully to database");
// });

// // this will match all http method api calls to /test
// app.use("/hello", (req, res) => {
//   res.send("Hello hello hello");
// });

// app.use("/", (req, res, next) => {
//   next();
//   res.send("Hello from the server");
// });

// app.use("/admin", adminAuth);
// app.use("/user", userAuth);

// app.get("/admin/getalldata", (req, res, next) => {
//   res.send("All data sent");
// });

// app.get("/user/getUserdata", (req, res, next) => {
//   try {
//     throw new Error("fgggrttrg");
//     res.send("User data sent");
//   } catch (error) {
//     res.status(500).send("something went wrong contact support team");
//   }
// });

// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.status(500).send("something went wrong");
//   }
// });

// app.get("/admin/deleteuser", (req, res, next) => {
//   res.send("Delete a user");
// });

// // app.get("/user", (req, res, next) => {
// //   res.send("User data sent");
// // });

// app.get("/user", [
//   (req, res, next) => {
//     // console.log(req.query);
//     next();
//     // res.send({ firstName: "Umang", lastName: "Nikhare" });
//   },
//   (req, res, next) => {
//     // console.log(req.query);
//     // res.send({ firstName: "Umang", lastName: "Nikhare123" });
//     next();
//   },
//   (req, res, next) => {
//     // console.log(req.query);
//     res.send({ firstName: "Umang", lastName: "Nikhare456" });
//     next();
//   },
//   (req, res, next) => {
//     // console.log(req.query);
//     // res.send({ firstName: "Umang", lastName: "Nikhare789" });
//     next();
//   },
//   (req, res, next) => {
//     // console.log(req.query);
//     // res.send({ firstName: "Umang", lastName: "Nikhare101112" });
//     next();
//   },
// ]);

// app.get("/user/:userId/:name/:password", (req, res) => {
//   console.log(req.params);
//   res.send({ firstName: "Umang", lastName: "Nikhare" });
// });

// app.get("/ab?c", (req, res) => {
//   res.send({ firstName: "Umang", lastName: "Nikhare" });
// });

// app.get("/ab+c", (req, res) => {
//   res.send({ firstName: "Umang", lastName: "Nikhare" });
// });

// app.get("/ab*cd", (req, res) => {
//   res.send({ firstName: "Umang", lastName: "Nikhare" });
// });

// app.get("/a(bc)?d", (req, res) => {
//   res.send({ firstName: "Umang", lastName: "Nikhare" });
// });

app.post("/signup", async (req, res) => {
  const userObj = req.body;

  // Validate the signup data
  const validation = validateSignupData(userObj);
  if (!validation.valid) {
    return res.status(validation.error.status).json(validation.error);
  }

  // Filter valid fields from user data
  const allowedFields = [
    "firstName",
    "lastName",
    "password",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
    "emailId",
  ];
  const filteredData = Object.fromEntries(
    Object.entries(userObj).filter(([key]) => allowedFields.includes(key))
  );

  try {
    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(filteredData.password, salt); // Hash the password

    // Replace the plain password with the hashed password
    filteredData.password = hashedPassword;

    // Check if the email already exists
    const existingUser = await User.findOne({ emailId: filteredData.emailId });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already in use.",
        field: "emailId",
        value: filteredData.emailId,
      });
    }

    // Create and save the new user
    const user = new User(filteredData);
    await user.save();

    // Respond with success
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error while adding user:", error);

    // Handle Mongoose ValidationError
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ message: "Validation error", errors });
    }

    // Handle MongoDB duplicate key error (e.g., email uniqueness)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `Duplicate field: ${duplicateField}`,
        field: duplicateField,
        value: error.keyValue[duplicateField],
      });
    }

    // Internal server error
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  // Check if email and password are provided
  if (!emailId || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token if password matches
    const token = jwt.sign(
      { userId: user._id, emailId: user.emailId }, // Payload
      JWT_SECRET_KEY, // Secret key for signing the token
      { expiresIn: "1h" } // Token expiration time
    );

    // Respond with the token
    res.status(200).json({
      message: "Login successful",
      token, // Send the token to the client
    });
  } catch (error) {
    console.error("Error while logging in:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.get("/user", async (req, res) => {
  const useremail = req.body.emailId; // Ideally, use req.query.emailId for GET requests

  try {
    // Find user by email
    const user = await User.find({ emailId: useremail });
    console.log(user);

    if (user.length === 0) {
      // No user found
      return res.status(404).json({ message: "User not found" });
    }

    // User found, send user details (exclude sensitive fields like password)
    res.status(200).json(user);
  } catch (error) {
    // Log error and respond
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.delete("/user", async (req, res) => {
  const userEmail = req.body.emailId; // Use query parameters

  try {
    // Delete the user by emailId
    const result = await User.findOneAndDelete({ emailId: userEmail });

    if (!result) {
      // User not found
      return res.status(404).json({ message: "User not found" });
    }

    // User deleted successfully
    res
      .status(200)
      .json({ message: "User deleted successfully", user: result });
  } catch (error) {
    // Log the error and send a response
    console.error("Error while deleting user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.patch("/user/:id", async (req, res) => {
  const { id } = req.params; // Get the user ID from the URL
  const allowedFields = [
    "firstName",
    "lastName",
    "password",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ]; // Allowed fields
  const updateData = {}; // Object to store valid fields

  // Filter the request body to include only allowed fields
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      updateData[key] = req.body[key];
    }
  });

  // Check if emailId is attempted to be updated
  if (req.body.emailId) {
    return res.status(400).json({
      message: "Updating emailId is not allowed.",
    });
  }

  // Validate `skills` field if provided
  if (updateData.skills) {
    if (!Array.isArray(updateData.skills)) {
      return res.status(400).json({
        message: "Invalid skills format. Skills must be an array of strings.",
      });
    }

    // Check if all elements in the array are strings
    const allStrings = updateData.skills.every(
      (skill) => typeof skill === "string"
    );
    if (!allStrings) {
      return res.status(400).json({
        message: "Invalid skills format. All skills must be strings.",
      });
    }

    // Check if the array has more than 5 elements
    if (updateData.skills.length > 5) {
      return res.status(400).json({
        message: "Too many skills provided. Maximum 5 skills are allowed.",
      });
    }
  }

  // If updateData is empty, no valid fields were provided
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      message: "No valid fields provided for update.",
    });
  }

  try {
    // Find the user by ID and update the specified fields
    const updatedUser = await User.findByIdAndUpdate(
      id, // User ID
      updateData, // Fields to update
      { new: true, runValidators: true } // Return updated user and validate updates
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error while updating user:", error);

    if (error.name == "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// feed api -get/feed - get all users from the database
// app.get("/feed", (req, res) => {

// });

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () =>
      console.log("Server is successfully listening on port 3000")
    );
  })
  .catch((err) => {
    console.error("Database cannot be connnected");
  });
