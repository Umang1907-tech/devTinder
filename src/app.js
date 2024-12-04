const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("Hello from the server");
});

app.use("/dashboard", (req, res) => {
  res.send("Hello from dashboard");
});

app.use("/hello", (req, res) => {
  res.send("Hello hello hello");
});

app.listen(3000, () =>
  console.log("server is successfully listening on port 3000")
);
