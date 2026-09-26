const express = require("express");

const {
    showCreateSession,
    createSession,
    showAvailableSessions,
    showSessionDetails,
    joinSession,
    showMySessions,
    showJoinedSessions,
    cancelSession
} = require("../controllers/sessionController");

const {
    requireLogin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/sessions/create",
    requireLogin,
    showCreateSession
);

router.post(
    "/sessions/create",
    requireLogin,
    createSession
);

router.get(
    "/sessions/available",
    requireLogin,
    showAvailableSessions
);

router.get(
    "/sessions/my",
    requireLogin,
    showMySessions
);

router.get(
    "/sessions/joined",
    requireLogin,
    showJoinedSessions
);

router.get(
    "/sessions/:id",
    requireLogin,
    showSessionDetails
);

router.post(
    "/sessions/:id/join",
    requireLogin,
    joinSession
);

router.post(
    "/sessions/:id/cancel",
    requireLogin,
    cancelSession
);

module.exports = router;