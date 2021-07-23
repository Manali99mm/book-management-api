// Initializing Express Router
const Router = require("express").Router();

// Database model
const BookModel = require("../../database/book");

/* 
Route           /
Description     Get all books
Access          PUBLIC
Parameters      None
Method          GET
*/
Router.get("/", async (req, res) => {
    try {
        const getAllBooks = await BookModel.find();
        return res.json(getAllBooks);
    } catch (error) {
        return res.json({ error: error.message });
    }
})

/*
Route           /isbn
Description     Get specific book based on ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/
Router.get("/isbn/:isbn", async (req, res) => {
    try {
        const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });

        if (!getSpecificBook) {
            return res.json({ error: `No book found with the ISBN of ${req.params.isbn}` });
        }

        return res.json({ book: getSpecificBook });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

/*
Route           /c
Description     Get specific book based on category
Access          PUBLIC
Parameters      category
Method          GET
*/
Router.get("/c/:category", async (req, res) => {
    try {
        const getSpecificBooks = await BookModel.find({ category: req.params.category });

        if (!getSpecificBooks) {
            return res.json({ error: `No book found for the category of ${req.params.category}` });
        }

        return res.json({ book: getSpecificBooks });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

/*
Route           /lang
Description     Get specific book based on language
Access          PUBLIC
Parameters      language
Method          GET
*/
Router.get("/lang/:language", async (req, res) => {
    try {
        const getSpecificBooks = await BookModel.find({ language: req.params.language });

        if (!getSpecificBooks) {
            return res.json({ error: `No book found for the language ${req.params.language}` });
        }

        return res.json({ books: getSpecificBooks });
    } catch (error) {
        return res.json({ error: error.message });
    }
});

/*
Route           /book/new
Description     add new book
Access          PUBLIC
Parameters      none
Method          POST
*/
Router.post("/new", async (req, res) => {
    try {
        const { newBook } = req.body;

        await BookModel.create(newBook);

        return res.json({ message: "book was added!" });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

/*
Route           /book/update/title
Description     update book title
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
Router.put("/update/title/:isbn", async (req, res) => {
    try {
        const updatedBook = await BookModel.findOneAndUpdate(
            {
                ISBN: req.params.isbn
            },
            {
                title: req.body.bookTitle
            },
            {
                new: true
            }
        )

        return res.json({ book: updatedBook });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

/*
Route           /book/update/author
Description     Update/Add new author for a book
Access          PUBLIC
Parameters      isbn, authorId
Method          PUT
*/
Router.put("/update/author/:isbn/:authorId", async (req, res) => {
    try {
        // update book database
        const updatedBook = await BookModel.findOneAndUpdate(
            {
                ISBN: req.params.isbn
            },
            {
                $addToSet: {
                    authors: req.params.authorId
                }
            },
            {
                new: true
            }
        )

        // update author database
        const updatedAuthor = await AuthorModel.findOneAndUpdate(
            {
                id: req.params.authorId
            },
            {
                $addToSet: {
                    books: req.params.isbn
                }
            },
            { new: true }
        )

        return res.json({ book: updatedBook, author: updatedAuthor, message: "new author was added" });
    } catch (error) {
        return res.json({ error: error.message })
    }
});

/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
Router.delete("/delete/:isbn", async (req, res) => {
    try {
        const deletedBook = await BookModel.findOneAndDelete({
            ISBN: req.params.isbn
        })

        return res.json({ message: "book was deleted!!", book: deletedBook });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

/*
Route           /book/delete/author
Description     delete an author from a book
Access          PUBLIC
Parameters      isbn, authorId
Method          DELETE
*/
Router.delete("/delete/author/:isbn/:authorId", async (req, res) => {
    try {
        // update the book database
        const updatedBookDatabase = await BookModel.findOneAndUpdate(
            {
                ISBN: req.params.isbn
            },
            {
                $pull: {
                    authors: parseInt(req.params.authorId)
                }
            },
            { new: true }
        )

        // update the author database
        const updatedAuthorDatabase = await AuthorModel.findOneAndUpdate(
            {
                id: parseInt(req.params.authorId)
            },
            {
                $pull: {
                    books: req.params.isbn
                }
            },
            { new: true }
        )

        return res.json({
            message: "author was deleted",
            books: updatedBookDatabase,
            authors: updatedAuthorDatabase
        });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

module.exports = Router;