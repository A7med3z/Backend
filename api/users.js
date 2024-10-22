const User = require("../models/users.js");
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    try { await user.save(); } catch (error) {
        res.status(400).json({ status: "failed to register" });
        return;
    }
    res.status(200).json({ status: "successfully registered" });
}

exports.login = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email }).select("+password");
    if (!user || !await user.correctPassword(req.body.password, user.password)) {
        res.status(400).json({ status: "wrong email or passwoed" });
        return;
    }
    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET);
    res.cookie("token", token);
    res.status(200).json({
        name: user.name,
        email: user.email,
        status: "successfully logged in"
    });
}

exports.protect = async (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(400).json({ status: "log in first" });
        return
    }
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
        res.status(400).json({ status: "session expired, please log in again" });
        return;
    }
    req.user = await User.findById(decoded.id);
    next();
}