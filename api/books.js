const Book = require("../models/books.js");

exports.getAll = async (req, res, next) => {
    const books = await Book.find({ available: true }).select('-__v -n_borrows -available');
    if (!books) {
        res.status(400).json({ status: "no available books" });
        return;
    }
    res.status(200).json(books);
}

exports.addBook = async (req, res, next) => {
    if (!req.user.isAdmin) {
        res.status(400).json({ status: "action not authorized" });
        return;
    }
    const book = new Book({
        bookISBN: req.body.bookISBN,
        title: req.body.title,
        author_name: req.body.author_name
    });
    try {
        await book.save();
    } catch (error) {
        res.status(400).json({ status: "failed to add book" });
        return;
    }
    res.status(200).json({ status: "book added successfully" });
}

exports.updateBook = async (req, res, next) => {
    if (!req.user.isAdmin) {
        res.status(400).json({ status: "action not authorized" });
        return;
    }
    await Book.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json({ status: "book updated successfully" });
}

exports.deleteBook = async (req, res, next) => {
    if (!req.user.isAdmin) {
        res.status(400).json({ status: "action not authorized" });
        return;
    }
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "book deleted successfully" });
}