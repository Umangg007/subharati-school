const { app } = require("./app");
const { connectDb } = require("./config/db");
const { env } = require("./config/env");

const start = async () => {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`API running on port ${env.port}`);
  });
};

start();
