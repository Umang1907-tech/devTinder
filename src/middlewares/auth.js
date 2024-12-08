const adminAuth = (req, res, next) => {
  console.log("Admin auth getting called!");
  const token = "xyz";
  const isauthorized = token == "xyz";
  if (!isauthorized) {
    res.status(401).send("Unauthorized Auth request");
  } else {
    // res.send("admin data from admin auth..")
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("User auth getting called!");
  const token = "xyz";
  const isauthorized = token == "xyz";
  if (!isauthorized) {
    res.status(401).send("Unauthorized User request");
  } else {
    // res.send("user data from user auth..");
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
