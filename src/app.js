const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const connectionRouter = require("./routes/connections");

app.use(express.json());
app.use(cookieParser());

app.use("/user", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/network", connectionRouter)

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed :", error.message);
  });
