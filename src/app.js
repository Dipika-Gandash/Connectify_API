const express = require("express");
const connectDB = require("./config/database");
require('dotenv').config();
const app = express();

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Database connection failed :", error.message);
  });
