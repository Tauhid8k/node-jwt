const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// mongoose (MongoDB Connection)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
connectDB();

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});

// routes
app.get("*", checkUser);
app.use(authRoutes);
app.get("/", (req, res) => res.render("home"));
app.get("/items", requireAuth, (req, res) => res.render("items"));
