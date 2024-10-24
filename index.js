var express = require('express');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { register, login, protect } = require('./api/users.js');
const { getAll, addBook, updateBook, deleteBook } = require('./api/books.js');
const { borrowBook, returnBook, borrowHistory } = require('./api/borrowing.js');
const { borrowedBooks, popularBooks } = require('./api/reports.js');


const PORT = process.env.PORT || 8800;

var app = express();

dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongoDB.");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});

app.use(express.json({ limit: "10kb" }));

app.post('/api/register', register);
app.post('/api/login', login);

app.get('/api/books', protect, getAll);
app.post('/api/books', protect, addBook);
app.put('/api/books/:id', protect, updateBook);
app.delete('/api/books/:id', protect, deleteBook);

app.post('/api/return', protect, returnBook);
app.post('/api/borrow', protect, borrowBook);
app.get('/api/borrow/history', protect, borrowHistory);

app.get('/api/reports/popular', protect, popularBooks);
app.get('/api/reports/borrowed', protect, borrowedBooks);

app.listen(PORT, () => {
    connect();
    console.log("Connected to backend.");
});