import { configDotenv } from "dotenv";

process.on("uncaughtException", (err) => {
  console.error(err.name, err.message);
  process.exit(1);
});

import app from "./index.js";
configDotenv();

const port = process.env.PORT || 8001;

const server = app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
