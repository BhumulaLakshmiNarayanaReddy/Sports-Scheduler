const bcrypt = require("bcrypt");

const User = require("../models/User");


/* =========================
   SHOW SIGNUP
========================= */

const showSignup = (req, res) => {
    res.render("auth/signup", {
        error: null
    });
};


/* =========================
   SIGNUP
========================= */

const signup = async (req, res) => {
    try {

        const {
            role,
            name,
            email,
            password
        } = req.body;


        if (
            !role ||
            !name ||
            !email ||
            !password
        ) {
            return res.render(
                "auth/signup",
                {
                    error:
                        "All fields are required."
                }
            );
        }


        if (
            !["player", "admin"].includes(role)
        ) {
            return res.render(
                "auth/signup",
                {
                    error:
                        "Please select a valid account type."
                }
            );
        }


        const cleanName =
            name.trim();


        const cleanEmail =
            email.trim().toLowerCase();


        if (!cleanName) {
            return res.render(
                "auth/signup",
                {
                    error:
                        "Name cannot be empty."
                }
            );
        }


        if (!cleanEmail) {
            return res.render(
                "auth/signup",
                {
                    error:
                        "Email cannot be empty."
                }
            );
        }


        if (password.length < 6) {
            return res.render(
                "auth/signup",
                {
                    error:
                        "Password must be at least 6 characters."
                }
            );
        }


        const existingUser =
            await User.findOne({
                email: cleanEmail
            });


        if (existingUser) {
            return res.render(
                "auth/signup",
                {
                    error:
                        "An account with this email already exists."
                }
            );
        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        await User.create({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
            role
        });


        res.redirect("/login");

    } catch (error) {

        console.error(
            "Signup error:",
            error.message
        );


        res.render(
            "auth/signup",
            {
                error:
                    "Something went wrong. Please try again."
            }
        );
    }
};


/* =========================
   SHOW LOGIN
========================= */

const showLogin = (req, res) => {
    res.render("auth/login", {
        error: null
    });
};


/* =========================
   LOGIN
========================= */

const login = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {
            return res.render(
                "auth/login",
                {
                    error:
                        "Email and password are required."
                }
            );
        }


        const cleanEmail =
            email.trim().toLowerCase();


        const user =
            await User.findOne({
                email: cleanEmail
            });


        if (!user) {
            return res.render(
                "auth/login",
                {
                    error:
                        "Invalid email or password."
                }
            );
        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {
            return res.render(
                "auth/login",
                {
                    error:
                        "Invalid email or password."
                }
            );
        }


        req.session.userId =
            user._id;

        req.session.role =
            user.role;

        req.session.name =
            user.name;


        res.redirect(
            "/dashboard"
        );

    } catch (error) {

        console.error(
            "Login error:",
            error.message
        );


        res.render(
            "auth/login",
            {
                error:
                    "Something went wrong. Please try again."
            }
        );
    }
};


/* =========================
   LOGOUT
========================= */

const logout = (req, res) => {

    req.session.destroy(
        error => {

            if (error) {
                console.error(
                    "Logout error:",
                    error.message
                );
            }

            res.redirect(
                "/login"
            );
        }
    );
};


module.exports = {
    showSignup,
    signup,
    showLogin,
    login,
    logout
};
