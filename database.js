const books = [
    {
        ISBN: "12345One",
        title: "Getting started with MERN",
        pubDate: "20-07-2021",
        language: "en",
        numPage: 270,
        author: [1, 2],
        publication: 1,
        category: ["tech", "education", "web dev"]
    },

    {
        ISBN: "12345Two",
        title: "Getting started with Python",
        pubDate: "15-06-2020",
        language: "en",
        numPage: 270,
        author: [1, 2],
        publication: 1,
        category: ["tech", "programming", "education", "web dev"]
    },
    {
        ISBN: "12345Three",
        title: "The World of React",
        pubDate: "20-07-2021",
        language: "en",
        numPage: 270,
        author: [1, 2],
        publication: 1,
        category: ["tech", "web dev", "education"]
    }
];

const authors = [
    {
        id: 1,
        name: "Manali",
        books: ["12345One", "12345Three"]
    },
    {
        id: 2,
        name: "Elon Musk",
        books: ["12345Two", "12345One"]
    }
];

const publications = [
    {
        id: 1,
        name: "HighTech",
        books: ["12345One", "12345Two", "12345Three"]
    }
];

module.exports = {
    books,
    authors,
    publications
}