const express = require("express");

const {
    showSports,
    createSport,
    editSport,
    showReports
} = require("../controllers/adminController");

const {
    requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/admin/sports",
    requireAdmin,
    showSports
);

router.post(
    "/admin/sports",
    requireAdmin,
    createSport
);

router.post(
    "/admin/sports/:id/edit",
    requireAdmin,
    editSport
);

router.get(
    "/admin/reports",
    requireAdmin,
    showReports
);

module.exports = router;