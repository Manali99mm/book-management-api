const express = require('express');

const database = require("./database")

const PORT = 3000;

const app = express();

/* 
Route           /
Description     Get all books
Access          PUBLIC
Parameters      None
Method          GET
*/
app.get("/", (req, res) => {
    return res.json({ books: database.books });
})

/*
Route           /isbn
Description     Get specific book based on ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/
app.get("/isbn/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.ISBN === req.params.isbn);

    if (getSpecificBook.length === 0) {
        return res.json({ error: `No book found with the ISBN of ${req.params.isbn}` });
    }

    return res.json({ book: getSpecificBook });
})

/*
Route           /c
Description     Get specific book based on category
Access          PUBLIC
Parameters      category
Method          GET
*/
app.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter(book => book.category.includes(req.params.category));

    if (getSpecificBook.length === 0) {
        return res.json({ error: `No book found for the category of ${req.params.category}` });
    }

    return res.json({ book: getSpecificBook });
})

/*
Route           /lang
Description     Get specific book based on language
Access          PUBLIC
Parameters      language
Method          GET
*/
app.get("/lang/:language", (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.language === req.params.language);

    if (getSpecificBook.length === 0) {
        return res.json({ error: `No book found for the language ${req.params.language}` });
    }

    return res.json({ book: getSpecificBook });
});

/*
Route           /author
Description     Get all authors
Access          PUBLIC
Parameters      none
Method          GET
*/
app.get("/author", (req, res) => {
    return res.json({ authors: database.authors });
})

/*
Route           /author
Description     Get specific author based on id
Access          PUBLIC
Parameters      id
Method          GET
*/
app.get("/author/:id", (req, res) => {
    const getSpecificAuthor = database.authors.filter((author) => author.id === parseInt(req.params.id));

    if (getSpecificAuthor.length === 0) {
        return res.json({ error: `No author found for the id of ${req.params.id}` });
    }

    return res.json({ author: getSpecificAuthor });
})

/*
Route           /author/book
Description     Get all authors based on books
Access          PUBLIC
Parameters      isbn
Method          GET
*/
app.get("/author/book/:isbn", (req, res) => {
    const getSpecificAuthor = database.authors.filter((author) => author.books.includes(req.params.isbn));

    if (getSpecificAuthor.length === 0) {
        return res.json({ error: `No author found for the book of ${req.params.isbn}` });
    }

    return res.json({ authors: getSpecificAuthor });
})

/*
Route           /publications
Description     Get all publications
Access          PUBLIC
Parameters      none
Method          GET
*/
app.get("/publications", (req, res) => {
    return res.json({ publications: database.publications });
})

/*
Route           /publications
Description     Get specific publication based on id
Access          PUBLIC
Parameters      id
Method          GET
*/
app.get("/publications/:id", (req, res) => {
    const getSpecificPublication = database.publications.filter((publication) => publication.id === parseInt(req.params.id));

    if (getSpecificPublication.length === 0) {
        return res.json({ error: `No publication found for the id of ${req.params.id}` });
    }

    return res.json({ publication: getSpecificPublication });
})

/*
Route           /publications/book
Description     Get all publications based on books
Access          PUBLIC
Parameters      isbn
Method          GET
*/
app.get("/publications/book/:isbn", (req, res) => {
    const getSpecificPublication = database.publications.filter((publication) => publication.books.includes(req.params.isbn));

    if (getSpecificPublication.length === 0) {
        return res.json({ error: `No publication found for the book of ${req.params.isbn}` });
    }

    return res.json({ publications: getSpecificPublication });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});