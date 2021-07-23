// Initializing Express Router
const Router = require("express").Router();

// Database model
const AuthorModel = require("../../database/author");

/*
Route           /author
Description     Get all authors
Access          PUBLIC
Parameters      none
Method          GET
*/
Router.get("/", async (req, res) => {
    try {
        const getAllAuthors = await AuthorModel.find();
        return res.json({ authors: getAllAuthors });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

/*
Route           /author
Description     Get specific author based on id
Access          PUBLIC
Parameters      id
Method          GET
*/
Router.get("/:id", async (req, res) => {
    try {
        const getSpecificAuthor = await AuthorModel.findOne({ id: parseInt(req.params.id) });

        if (!getSpecificAuthor) {
            return res.json({ error: `No author found for the id of ${req.params.id}` });
        }

        return res.json({ author: getSpecificAuthor });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

/*
Route           /author/book
Description     Get all authors based on books
Access          PUBLIC
Parameters      isbn
Method          GET
*/
Router.get("/book/:isbn", async (req, res) => {
    try {
        const getSpecificAuthor = await AuthorModel.find({ books: req.params.isbn });

        if (!getSpecificAuthor) {
            return res.json({ error: `No author found for the book of ${req.params.isbn}` });
        }

        return res.json({ authors: getSpecificAuthor });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      none
Method          POST
*/
Router.post("/new", async (req, res) => {
    try {
        const { newAuthor } = req.body;

        await AuthorModel.create(newAuthor);

        return res.json({ message: "author was added!" });
    } catch (error) {
        return res.json({ error: error.message });
    }

})

/*
Route           /author/update/name
Description     Update author name
Access          PUBLIC
Parameters      authorId
Method          PUT
*/
Router.put("/update/name/:authorId", async (req, res) => {
    try {
        const updatedAuthor = await AuthorModel.findOneAndUpdate(
            {
                id: parseInt(req.params.authorId)
            },
            {
                name: req.body.newAuthorName
            },
            {
                new: true
            }
        )

        return res.json({ author: updatedAuthor });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

/*
Route           /author/delete
Description     delete an author
Access          PUBLIC
Parameters      authorId
Method          DELETE
*/
Router.delete("/delete/:authorId", async (req, res) => {
    try {
        const deletedAuthor = await AuthorModel.findOneAndDelete({
            id: req.params.authorId
        })

        return res.json({
            message: "author was deleted!",
            author: deletedAuthor
        });
    } catch (error) {
        return res.json({ error: error.message });
    }
});


module.exports = Router;