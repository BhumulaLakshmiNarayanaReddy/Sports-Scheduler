const express = require("express");

const {
    showDashboard
} = require("../controllers/dashboardController");

const {
    requireLogin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", requireLogin, showDashboard);

module.exports = router;