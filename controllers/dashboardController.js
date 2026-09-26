const showDashboard = (req, res) => {
    res.render("dashboard", {
        name: req.session.name,
        role: req.session.role
    });
};

module.exports = {
    showDashboard
};