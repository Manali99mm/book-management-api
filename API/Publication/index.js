// Initializing Express Router
const Router = require("express").Router();

// Database model
const PublicationModel = require("../../database/publication");

/*
Route           /publication
Description     Get all publications
Access          PUBLIC
Parameters      none
Method          GET
*/
Router.get("/", async (req, res) => {
    try {
        const getAllPublications = await PublicationModel.find();
        return res.json({ publications: getAllPublications });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

/*
Route           /publication
Description     Get specific publication based on id
Access          PUBLIC
Parameters      id
Method          GET
*/
Router.get("/:id", async (req, res) => {
    try {
        const getSpecificPublication = await PublicationModel.findOne({ id: parseInt(req.params.id) });

        if (!getSpecificPublication) {
            return res.json({ error: `No publication found for the id of ${req.params.id}` });
        }

        return res.json({ publication: getSpecificPublication });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

/*
Route           /publication/book
Description     Get all publications based on books
Access          PUBLIC
Parameters      isbn
Method          GET
*/
Router.get("/book/:isbn", async (req, res) => {
    try {
        const getSpecificPublication = await PublicationModel.findOne({ books: req.params.isbn });

        if (!getSpecificPublication) {
            return res.json({ error: `No publication found for the book of ${req.params.isbn}` });
        }

        return res.json({ publications: getSpecificPublication });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

/*
Route           /publication/new
Description     add new publication
Access          PUBLIC
Parameters      none
Method          POST
*/
Router.post("/new", async (req, res) => {
    try {
        const { newPublication } = req.body;

        await PublicationModel.create(newPublication);

        return res.json({ message: "publication was added!" });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

/*
Route           /publication/update/name
Description     Update publication name
Access          PUBLIC
Parameters      pubId
Method          PUT
*/
Router.put("/update/name/:pubId", async (req, res) => {
    try {
        const updatedPublication = await PublicationModel.findOneAndUpdate(
            {
                id: parseInt(req.params.pubId)
            },
            {
                name: req.body.newPublicationName
            },
            {
                new: true
            }
        )

        return res.json({ publications: updatedPublication });
    } catch (error) {
        return res.json({ error: error.message });
    }
});

/*
Route           /publication/update/book
Description     update/add new book to publication
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
Router.put("/update/book/:isbn", async (req, res) => {
    try {
        // update the publication database
        const updatedPublication = await PublicationModel.findOneAndUpdate(
            {
                id: req.body.pubId
            },
            {
                $addToSet: {
                    books: req.params.isbn
                }
            },
            { new: true }
        )

        // update the book database
        const updatedBook = await BookModel.findOneAndUpdate(
            {
                ISBN: req.params.isbn
            },
            {
                publication: req.body.pubId
            },
            { new: true }
        )

        return res.json({ book: updatedBook, publication: updatedPublication });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

/*
Route           /publication/delete
Description     delete a publication
Access          PUBLIC
Parameters      pubId
Method          DELETE
*/
Router.delete("/delete/:pubId", async (req, res) => {
    try {
        const deletedPublication = await PublicationModel.findOneAndDelete({
            id: req.params.pubId
        })

        return res.json({
            message: "publication was deleted!",
            publications: deletedPublication
        });
    } catch (error) {
        return res.json({ error: error.message });
    }
});

/*
Route           /publication/delete/book
Description     delete a book from publication
Access          PUBLIC
Parameters      isbn, publication id
Method          DELETE
*/
Router.delete("/delete/book/:isbn/:pubId", async (req, res) => {
    try {
        // update the publication database
        const updatedPublicationDatabase = await PublicationModel.findOneAndUpdate(
            {
                id: parseInt(req.params.pubId)
            },
            {
                $pull: {
                    books: req.params.isbn
                }
            },
            {
                new: true
            }
        )

        // update the book database
        const updatedBookDatabase = await BookModel.findOneAndUpdate(
            {
                ISBN: req.params.isbn
            },
            {
                publication: 0 // no publication available
            },
            { new: true }
        )

        return res.json({
            message: "book was deleted from publication",
            books: updatedBookDatabase,
            publications: updatedPublicationDatabase
        });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

module.exports = Router;