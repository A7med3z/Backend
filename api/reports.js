const Borrowing = require("../models/borrowing.js");
const Book = require("../models/books.js");

exports.borrowedBooks = async (req, res, next) => {
    if (!req.user.isAdmin) {
        res.status(400).json({ status: "action not authorized" });
        return;
    }
    const borrowed = await Borrowing.find({ to: null });
    res.status(200).json(borrowed);
}

exports.popularBooks = async (req, res, next) => {
    if (!req.user.isAdmin) {
        res.status(400).json({ status: "action not authorized" });
        return;
    }
    const popular = await Book.find().sort({n_borrows: -1}).limit(10);
    res.status(200).json(popular);
}