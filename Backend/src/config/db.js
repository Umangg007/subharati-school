const mongoose = require("mongoose");
const { env } = require("./env");

const connectDb = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is not set");
  }
  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected");
};

module.exports = { connectDb };
