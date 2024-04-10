
const books = [{
        ISBN: "12345Book",
        title: "tesla",
        pubDate: "2023-01-05",
        language: ["en"],
        numpage: 250,
        author: [1, 2],
        publications: [1],
        category: ["tech", "space", "education"]
    },
    {
        ISBN: "12345678Book",
        title: "nadodigal",
        pubDate: "2023-01-05",
        language: ["tam"],
        numpage: 250,
        author: [1, 2],
        publications: [1],
        category: ["tech", "space", "education"]
    }
];

const author = [{
        id: 1,
        name: "Aradhana",
        books: ["Tesla","12345Book","secretBook"]
    },
    {
        id: 2,
        name: "Elon Musk",
        books: ["Tesla"]
    }
];

const publication = [{
        id: 1,
        name: "writex",
        books: ["12345book"]
    },
    {
        id: 2,
        name: "writex2",
        books: []
    }
];

// Exporting the dataset
module.exports = {
    books,
    author,
    publication
};
