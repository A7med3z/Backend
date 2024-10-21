const mongoose = require("mongoose");

const BorrowingSchema = new mongoose.Schema(
    {
        book_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date,
            default: null
        }
    }
)

module.exports = mongoose.model('Borrowing', BorrowingSchema);