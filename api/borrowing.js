const Borrowing = require("../models/borrowing.js");
const Book = require("../models/books.js");

exports.borrowBook = async(req, res, next) => {
    const book = await Book.findById(req.body.book_id);
    if (!book || !book.available) {
        res.status(400).json({ status: "book is not available" });
        return;
    }
    const borrow = new Borrowing({
        book_id: book._id,
        user_id: req.user._id,
        from: new Date(Date.now())
    });
    await borrow.save();
    await Book.findByIdAndUpdate(book._id, {$set: {available: false, n_borrows: book.n_borrows + 1}}, { new: true });
    res.status(200).json({status: "book is borrowed successfully"});
}

exports.returnBook = async(req, res, next) => {
    const borrow = await Borrowing.findOne({_id: req.body.borrowing_id, user_id: req.user._id, to: null});
    if (!borrow) {
        res.status(400).json({ status: "action not authorized" });
        return;
    }
    await Borrowing.findByIdAndUpdate(req.body.borrowing_id, {$set: {to: new Date(Date.now())}}, { new: true });
    await Book.findByIdAndUpdate(borrow.book_id, {$set: {available: true}}, { new: true });
    res.status(200).json({status: "book is returned successfully"});
}

exports.borrowHistory = async(req, res, next) => {
    const history = await Borrowing.find({user_id: req.user._id}).populate({
        path: 'book',
        select: '-_id -n_borrows -available -__v'
    }).select('-__v -user_id');
    res.status(200).json(history);
}