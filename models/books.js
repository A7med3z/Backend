const mongoose = require("mongoose");
const { Schema } = mongoose;


const BookSchema = new mongoose.Schema(
    {
        bookISBN: {
            type: String,
            required: true,
            unique: true
        },
        title: {
            type: String,
            required: true
        },
        author_name: {
            type: String,
            required: true
        },
        n_borrows: {
            type: Number,
            default: 0
        },
        available: {
            type: Boolean,
            default: true
        }
    }
)

module.exports = mongoose.model('Book', BookSchema);