require("dotenv").config();

const express = require('express');
const mongoose = require("mongoose");

// Microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

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

// Initializing Microservices
app.use("/book", Books);
app.use("/author", Authors);
app.use("/publication", Publications);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});