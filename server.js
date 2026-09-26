require("dotenv").config();

const express = require("express");
const session = require("express-session");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// EJS
app.set("view engine", "ejs");

// Read form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// Sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

// Routes
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", adminRoutes);
app.use("/", sessionRoutes);

// Home
app.get("/", (req, res) => {
    res.send("Sports Scheduler is running!");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});