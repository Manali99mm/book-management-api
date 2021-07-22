require("dotenv").config();

const express = require('express');
const mongoose = require("mongoose");

// Database
const database = require("./database/database");

// Models
const BookModels = require("./database/book");
const AuthorModels = require("./database/author");
const PublicationModels = require("./database/publication");

const PORT = 3000;

const app = express();
app.use(express.json());

// establish database connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log("Connection established!"));

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

/*
Route           /book/new
Description     add new book
Access          PUBLIC
Parameters      none
Method          POST
*/
app.post("/book/new", (req, res) => {
    const { newBook } = req.body;

    database.books.push(newBook);

    return res.json({ books: database.books });
})

/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      none
Method          POST
*/
app.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;

    database.authors.push(newAuthor);

    return res.json({ authors: database.authors });
})

/*
Route           /publication/new
Description     add new publication
Access          PUBLIC
Parameters      none
Method          POST
*/
app.post("/publication/new", (req, res) => {
    const { newPublication } = req.body;

    database.publications.push(newPublication);

    return res.json({ publications: database.publications });
})

/*
Route           /book/update/title
Description     update book title
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
app.put("/book/update/title/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.newBookTitle;
            return;
        }
    });

    return res.json({ books: database.books });
})

/*
Route           /book/update/author
Description     Update/Add new author for a book
Access          PUBLIC
Parameters      isbn, authorId
Method          PUT
*/
app.put("/book/update/author/:isbn/:authorId", (req, res) => {
    // update book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            return book.authors.push(parseInt(req.params.authorId));
        }
    })

    // update author database
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) return author.books.push(req.params.isbn);
    });

    return res.json({ books: database.books, authors: database.authors });
});

/*
Route           /author/update/name
Description     Update author name
Access          PUBLIC
Parameters      authorId
Method          PUT
*/
app.put("/author/update/name/:authorId", (req, res) => {
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            author.name = req.body.newAuthorName;
            return;
        }
    });

    return res.json({ authors: database.authors });
})

/*
Route           /publication/update/name
Description     Update publication name
Access          PUBLIC
Parameters      pubId
Method          PUT
*/
app.put("/publication/update/name/:pubId", (req, res) => {
    database.publications.forEach((publication) => {
        if (publication.id === parseInt(req.params.pubId)) {
            publication.name = req.body.newPublicationName;
            return;
        }
    });

    return res.json({ publications: database.publications });
});

/*
Route           /publication/update/book
Description     update/add new book to publication
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
app.put("/publication/update/book/:isbn", (req, res) => {
    // update the publication database
    database.publications.forEach((publication) => {
        if (publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn);
        }
    })

    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });

    return res.json({ books: database.books, publications: database.publications });
})

/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
app.delete("/book/delete/:isbn", (req, res) => {
    const updatedBookDatabase = database.books.filter((book) => book.ISBN !== req.params.isbn);

    database.books = updatedBookDatabase;
    return res.json({ books: database.books });
})

/*
Route           /book/delete/author
Description     delete an author from a book
Access          PUBLIC
Parameters      isbn, authorId
Method          DELETE
*/
app.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    // update a book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter((author) => author !== parseInt(req.params.authorId));

            book.authors = newAuthorList;
            return;
        }
    })

    // update the author database
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            const newBookList = author.books.filter((book) => book !== req.params.isbn);
            author.books = newBookList;
            return;
        }
    });

    return res.json({
        message: "author was deleted",
        books: database.books,
        authors: database.authors
    });
})

/*
Route           /author/delete
Description     delete an author
Access          PUBLIC
Parameters      authorId
Method          DELETE
*/
app.delete("/author/delete/:authorId", (req, res) => {
    const updatedAuthorDatabase = database.authors.filter((author) => author.id !== parseInt(req.params.authorId));

    database.authors = updatedAuthorDatabase;
    return res.json({
        authors: database.authors,
        message: "author was deleted!"
    });
});

/*
Route           /publication/delete
Description     delete a publication
Access          PUBLIC
Parameters      pubId
Method          DELETE
*/
app.delete("/publication/delete/:pubId", (req, res) => {
    const updatedPublicationDatabase = database.publications.filter((publication) => publication.id !== parseInt(req.params.pubId));

    database.publications = updatedPublicationDatabase;
    return res.json({
        message: "publication was deleted!",
        publications: database.publications
    });
});

/*
Route           /publication/delete/book
Description     delete a book from publication
Access          PUBLIC
Parameters      isbn, publication id
Method          DELETE
*/
app.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
    // update the publication database
    database.publications.forEach((publication) => {
        if (publication.id === parseInt(req.params.pubId)) {
            const updatedBookList = publication.books.filter((book) => book !== req.params.isbn);
            publication.books = updatedBookList;
            return;
        }
    });

    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = 0; // no publication available
            return;
        }
    });

    return res.json({
        message: "book was deleted from publication",
        books: database.books,
        publications: database.publications
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});