const mongoose = require("mongoose");

const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        minLength: 8
    },
    pubDate: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
    },
    numPage: {
        type: Number,
        required: true
    },
    authors: [Number],
    publication: {
        type: Number,
        required: true
    },
    category: [String]
});

const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;