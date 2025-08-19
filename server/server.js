import { configDotenv } from "dotenv";

process.on("uncaughtException", (err) => {
  console.error(err.name, err.message);
  process.exit(1);
});

import app from "./index.js";
import sequelize from "./sequelize.js";
configDotenv();

const port = process.env.PORT || 8001;

let server;
sequelize.sync().then(() => {
  server = app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
  });
});

process.on("unhandledRejection", (err) => {
  console.error(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
