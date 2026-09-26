const Sport = require("../models/Sport");
const SportSession = require("../models/SportSession");


/* =========================
   CREATE SESSION PAGE
========================= */

const showCreateSession = async (req, res) => {
    try {
        const sports = await Sport.find().sort({ name: 1 });

        res.render("sessions/create", {
            sports,
            error: null,
            role: req.session.role
        });

    } catch (error) {
        console.error(
            "Load create session error:",
            error.message
        );

        res.status(500).send(
            "Unable to load create session page."
        );
    }
};


/* =========================
   CREATE SESSION
========================= */

const createSession = async (req, res) => {
    try {
        const {
            sport,
            additionalPlayersNeeded,
            dateTime,
            venue
        } = req.body;

        const sports = await Sport.find().sort({
            name: 1
        });


        if (
            !sport ||
            !dateTime ||
            additionalPlayersNeeded === undefined ||
            !venue ||
            !venue.trim()
        ) {
            return res.render("sessions/create", {
                sports,
                error: "Please fill in all required fields.",
                role: req.session.role
            });
        }


        const sessionDate = new Date(dateTime);

        if (Number.isNaN(sessionDate.getTime())) {
            return res.render("sessions/create", {
                sports,
                error: "Please enter a valid date and time.",
                role: req.session.role
            });
        }


        if (sessionDate <= new Date()) {
            return res.render("sessions/create", {
                sports,
                error: "Session date and time must be in the future.",
                role: req.session.role
            });
        }


        const selectedSport = await Sport.findById(sport);

        if (!selectedSport) {
            return res.render("sessions/create", {
                sports,
                error: "Selected sport does not exist.",
                role: req.session.role
            });
        }


        const additionalPlayers =
            Number(additionalPlayersNeeded);


        if (
            !Number.isInteger(additionalPlayers) ||
            additionalPlayers < 0
        ) {
            return res.render("sessions/create", {
                sports,
                error: "Additional players must be a valid non-negative number.",
                role: req.session.role
            });
        }


        await SportSession.create({
            sport,
            createdBy: req.session.userId,

            teamA: [
                req.session.userId
            ],

            teamB: [],

            additionalPlayersNeeded:
                additionalPlayers,

            dateTime: sessionDate,

            venue: venue.trim(),

            joinedPlayers: [],

            status: "active"
        });


        res.redirect("/sessions/my");

    } catch (error) {

        console.error(
            "Create session error:",
            error.message
        );

        const sports = await Sport.find().sort({
            name: 1
        });

        res.render("sessions/create", {
            sports,
            error: "Unable to create session.",
            role: req.session.role
        });
    }
};


/* =========================
   AVAILABLE SESSIONS
========================= */

const showAvailableSessions = async (req, res) => {
    try {

        const sessions =
            await SportSession.find({
                status: "active",
                dateTime: {
                    $gt: new Date()
                }
            })
                .populate("sport")
                .populate("createdBy", "name")
                .populate("teamA", "name")
                .populate("teamB", "name")
                .populate("joinedPlayers", "name")
                .sort({
                    dateTime: 1
                });


        res.render("sessions/available", {
            sessions,
            role: req.session.role
        });

    } catch (error) {

        console.error(
            "Available sessions error:",
            error.message
        );

        res.status(500).send(
            "Unable to load available sessions."
        );
    }
};


/* =========================
   SESSION DETAILS
========================= */

const showSessionDetails = async (req, res) => {
    try {

        const session =
            await SportSession.findById(
                req.params.id
            )
                .populate("sport")
                .populate("createdBy", "name")
                .populate("teamA", "name")
                .populate("teamB", "name")
                .populate("joinedPlayers", "name");


        if (!session) {
            return res.status(404).send(
                "Session not found."
            );
        }


        res.render("sessions/details", {
            session,

            userId:
                req.session.userId.toString(),

            role:
                req.session.role
        });

    } catch (error) {

        console.error(
            "Session details error:",
            error.message
        );

        res.status(500).send(
            "Unable to load session."
        );
    }
};


/* =========================
   JOIN SESSION
========================= */

const joinSession = async (req, res) => {
    try {

        const session =
            await SportSession.findById(
                req.params.id
            );


        if (!session) {
            return res.status(404).send(
                "Session not found."
            );
        }


        if (session.status !== "active") {
            return res.send(
                "This session is no longer active."
            );
        }


        if (session.dateTime <= new Date()) {
            return res.send(
                "You cannot join a past session."
            );
        }


        const userId =
            req.session.userId.toString();


        if (
            session.createdBy.toString() ===
            userId
        ) {
            return res.send(
                "You created this session and are already participating."
            );
        }


        const inTeamA =
            session.teamA.some(
                id => id.toString() === userId
            );


        const inTeamB =
            session.teamB.some(
                id => id.toString() === userId
            );


        const alreadyJoined =
            session.joinedPlayers.some(
                id => id.toString() === userId
            );


        if (
            inTeamA ||
            inTeamB ||
            alreadyJoined
        ) {
            return res.send(
                "You are already participating in this session."
            );
        }


        if (
            session.joinedPlayers.length >=
            session.additionalPlayersNeeded
        ) {
            return res.send(
                "No additional player slots are available."
            );
        }


        /*
         * Prevent joining another session
         * at the exact same date and time.
         */

        const conflictingSession =
            await SportSession.findOne({
                _id: {
                    $ne: session._id
                },

                dateTime:
                    session.dateTime,

                status: "active",

                $or: [
                    {
                        createdBy:
                            req.session.userId
                    },

                    {
                        teamA:
                            req.session.userId
                    },

                    {
                        teamB:
                            req.session.userId
                    },

                    {
                        joinedPlayers:
                            req.session.userId
                    }
                ]
            });


        if (conflictingSession) {
            return res.send(
                "You already have another session at this date and time."
            );
        }


        session.joinedPlayers.push(
            req.session.userId
        );


        await session.save();


        res.redirect(
            `/sessions/${session._id}`
        );

    } catch (error) {

        console.error(
            "Join session error:",
            error.message
        );

        res.status(500).send(
            "Unable to join session."
        );
    }
};


/* =========================
   MY SESSIONS
========================= */

const showMySessions = async (req, res) => {
    try {

        const sessions =
            await SportSession.find({
                createdBy:
                    req.session.userId
            })
                .populate("sport")
                .populate("teamA", "name")
                .populate("teamB", "name")
                .populate("joinedPlayers", "name")
                .sort({
                    dateTime: 1
                });


        res.render("sessions/my", {
            sessions,
            role: req.session.role
        });

    } catch (error) {

        console.error(
            "My sessions error:",
            error.message
        );

        res.status(500).send(
            "Unable to load your sessions."
        );
    }
};


/* =========================
   JOINED SESSIONS
========================= */

const showJoinedSessions = async (req, res) => {
    try {

        const sessions =
            await SportSession.find({
                joinedPlayers:
                    req.session.userId
            })
                .populate("sport")
                .populate("createdBy", "name")
                .populate("teamA", "name")
                .populate("teamB", "name")
                .populate("joinedPlayers", "name")
                .sort({
                    dateTime: 1
                });


        res.render("sessions/joined", {
            sessions,
            role: req.session.role
        });

    } catch (error) {

        console.error(
            "Joined sessions error:",
            error.message
        );

        res.status(500).send(
            "Unable to load joined sessions."
        );
    }
};


/* =========================
   CANCEL SESSION
========================= */

const cancelSession = async (req, res) => {
    try {

        const session =
            await SportSession.findById(
                req.params.id
            );


        if (!session) {
            return res.status(404).send(
                "Session not found."
            );
        }


        if (
            session.createdBy.toString() !==
            req.session.userId.toString()
        ) {
            return res.status(403).send(
                "You can only cancel your own sessions."
            );
        }


        if (session.status === "cancelled") {
            return res.send(
                "This session is already cancelled."
            );
        }


        if (session.status === "completed") {
            return res.send(
                "A completed session cannot be cancelled."
            );
        }


        const {
            cancellationReason
        } = req.body;


        if (
            !cancellationReason ||
            !cancellationReason.trim()
        ) {
            return res.send(
                "Cancellation reason is required."
            );
        }


        session.status = "cancelled";

        session.cancellationReason =
            cancellationReason.trim();


        await session.save();


        res.redirect("/sessions/my");

    } catch (error) {

        console.error(
            "Cancel session error:",
            error.message
        );

        res.status(500).send(
            "Unable to cancel session."
        );
    }
};


module.exports = {
    showCreateSession,
    createSession,
    showAvailableSessions,
    showSessionDetails,
    joinSession,
    showMySessions,
    showJoinedSessions,
    cancelSession
};  