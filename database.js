const books = [
    {
        ISBN: "12345Book",
        title: "Getting started with MERN",
        pubDate: "20-07-2021",
        language: "en",
        numPage: 270,
        author: [1, 2],
        publications: [1],
        category: ["tech", "programming", "education"]
    }
];

const authors = [
    {
        id: 1,
        name: "Manali",
        books: ["12345Book"]
    },
    {
        id: 2,
        name: "Elon Musk",
        books: ["12345Book"]
    }
];

const publications = [
    {
        id: 1,
        name: "HighTech",
        books: ["12345Book"]
    }
];

module.exports = {
    books,
    authors,
    publications
}