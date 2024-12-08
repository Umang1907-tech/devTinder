const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
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

  // Create instance of User model
  const user = new User(userObj);
  try {
    // Example user object (replace with `req.body` for real-world usage)
    // const userObj = {
    //   firstName: "Virat",
    //   lastName: "Kohli",
    //   emailId: "virat14@gmail.com", // Ensure unique
    //   password: "virat@123",
    //   age: 25, // This will cause a validation error (non-numeric)
    //   gender: "male",
    // };

    await user.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    // Log error for debugging
    console.error("Error while adding user:", error);

    // Mongoose validation error
    if (error.name == "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ message: "Validation error", errors });
    }

    // Duplicate key error (e.g., unique email)
    if (error.code == 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `Duplicate field: ${duplicateField}`,
        field: duplicateField,
        value: error.keyValue[duplicateField],
      });
    }

    // Other errors
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// app.use("/", (err, req, res) => {
//   if (err) {
//     res.status(401).send("User is not properly authenticated");
//   }
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
