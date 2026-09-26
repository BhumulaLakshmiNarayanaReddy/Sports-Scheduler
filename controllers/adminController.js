const Sport = require("../models/Sport");
const SportSession = require("../models/SportSession");


/* =========================
   MANAGE SPORTS
========================= */

const showSports = async (req, res) => {
    try {

        const sports =
            await Sport.find()
                .sort({
                    createdAt: -1
                });


        res.render("admin/sports", {
            sports,
            error: null,
            success: null
        });

    } catch (error) {

        console.error(
            "Error loading sports:",
            error.message
        );

        res.status(500).send(
            "Unable to load sports."
        );
    }
};


/* =========================
   CREATE SPORT
========================= */

const createSport = async (req, res) => {
    try {

        const {
            name
        } = req.body;


        const sports =
            await Sport.find()
                .sort({
                    createdAt: -1
                });


        if (!name || !name.trim()) {
            return res.render(
                "admin/sports",
                {
                    sports,
                    error: "Sport name is required.",
                    success: null
                }
            );
        }


        const sportName =
            name.trim();


        const existingSport =
            await Sport.findOne({
                name: sportName
            });


        if (existingSport) {
            return res.render(
                "admin/sports",
                {
                    sports,
                    error:
                        "This sport already exists.",
                    success: null
                }
            );
        }


        await Sport.create({
            name: sportName,
            createdBy:
                req.session.userId
        });


        res.redirect(
            "/admin/sports"
        );

    } catch (error) {

        console.error(
            "Create sport error:",
            error.message
        );

        res.status(500).send(
            "Unable to create sport."
        );
    }
};


/* =========================
   EDIT SPORT
========================= */

const editSport = async (req, res) => {
    try {

        const {
            id
        } = req.params;

        const {
            name
        } = req.body;


        if (!name || !name.trim()) {
            return res.redirect(
                "/admin/sports"
            );
        }


        const sportName =
            name.trim();


        const existingSport =
            await Sport.findOne({
                name: sportName,
                _id: {
                    $ne: id
                }
            });


        if (existingSport) {
            return res.send(
                "A sport with this name already exists."
            );
        }


        await Sport.findByIdAndUpdate(
            id,
            {
                name: sportName
            }
        );


        res.redirect(
            "/admin/sports"
        );

    } catch (error) {

        console.error(
            "Edit sport error:",
            error.message
        );

        res.status(500).send(
            "Unable to edit sport."
        );
    }
};


/* =========================
   REPORTS
========================= */

const showReports = async (req, res) => {
    try {

        const {
            startDate,
            endDate
        } = req.query;


        let report = null;


        if (startDate || endDate) {

            if (!startDate || !endDate) {

                return res.render(
                    "admin/reports",
                    {
                        report: null,
                        startDate:
                            startDate || "",
                        endDate:
                            endDate || "",
                        error:
                            "Please select both start and end dates."
                    }
                );
            }


            const start =
                new Date(`${startDate}T00:00:00`);


            const end =
                new Date(`${endDate}T23:59:59.999`);


            if (
                Number.isNaN(
                    start.getTime()
                ) ||
                Number.isNaN(
                    end.getTime()
                )
            ) {

                return res.render(
                    "admin/reports",
                    {
                        report: null,
                        startDate,
                        endDate,
                        error:
                            "Please enter valid dates."
                    }
                );
            }


            if (start > end) {

                return res.render(
                    "admin/reports",
                    {
                        report: null,
                        startDate,
                        endDate,
                        error:
                            "Start date cannot be after end date."
                    }
                );
            }


            const now =
                new Date();


            /*
             * A played session must:
             * 1. Be inside selected period
             * 2. Not be cancelled
             * 3. Already have happened
             */

            const sessions =
                await SportSession.find({
                    dateTime: {
                        $gte: start,
                        $lte: end,
                        $lte: now
                    },

                    status: {
                        $ne: "cancelled"
                    }
                })
                    .populate("sport");


            const sportCounts = {};


            sessions.forEach(
                session => {

                    if (!session.sport) {
                        return;
                    }


                    const sportName =
                        session.sport.name;


                    if (
                        !sportCounts[
                            sportName
                        ]
                    ) {
                        sportCounts[
                            sportName
                        ] = 0;
                    }


                    sportCounts[
                        sportName
                    ]++;
                }
            );


            report = {
                totalSessions:
                    sessions.length,

                sportCounts
            };
        }


        res.render(
            "admin/reports",
            {
                report,
                startDate:
                    startDate || "",
                endDate:
                    endDate || "",
                error: null
            }
        );

    } catch (error) {

        console.error(
            "Reports error:",
            error.message
        );

        res.status(500).send(
            "Unable to generate reports."
        );
    }
};


module.exports = {
    showSports,
    createSport,
    editSport,
    showReports
};
