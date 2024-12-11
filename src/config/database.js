const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://unikhare99:Bsi7Ejylpsggsq0J@namastenode.lodte.mongodb.net/devTinder"
  );
};

module.exports = {
  connectDB,
};
