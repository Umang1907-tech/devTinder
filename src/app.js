const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");
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

app.use("/admin", adminAuth);
app.use("/user", userAuth);

app.get("/admin/getalldata", (req, res, next) => {
  res.send("All data sent");
});

app.get("/user/getUserdata", (req, res, next) => {
  res.send("User data sent");
});

app.get("/admin/deleteuser", (req, res, next) => {
  res.send("Delete a user");
});

// app.get("/user", (req, res, next) => {
//   res.send("User data sent");
// });

app.get("/user", [
  (req, res, next) => {
    // console.log(req.query);
    next();
    // res.send({ firstName: "Umang", lastName: "Nikhare" });
  },
  (req, res, next) => {
    // console.log(req.query);
    // res.send({ firstName: "Umang", lastName: "Nikhare123" });
    next();
  },
  (req, res, next) => {
    // console.log(req.query);
    res.send({ firstName: "Umang", lastName: "Nikhare456" });
    next();
  },
  (req, res, next) => {
    // console.log(req.query);
    // res.send({ firstName: "Umang", lastName: "Nikhare789" });
    next();
  },
  (req, res, next) => {
    // console.log(req.query);
    // res.send({ firstName: "Umang", lastName: "Nikhare101112" });
    next();
  },
]);

app.get("/user/:userId/:name/:password", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "Umang", lastName: "Nikhare" });
});

app.get("/ab?c", (req, res) => {
  res.send({ firstName: "Umang", lastName: "Nikhare" });
});

app.get("/ab+c", (req, res) => {
  res.send({ firstName: "Umang", lastName: "Nikhare" });
});

app.get("/ab*cd", (req, res) => {
  res.send({ firstName: "Umang", lastName: "Nikhare" });
});

app.get("/a(bc)?d", (req, res) => {
  res.send({ firstName: "Umang", lastName: "Nikhare" });
});

app.listen(3000, () =>
  console.log("server is successfully listening on port 3000")
);
