require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

var bodyParser = require("body-parser");

const database = require("./database");
const { config } = require("dotenv");

const booky=express();

booky.use(bodyParser.urlencoded({extended:true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
})
.then(() => {
    console.log("Connection Established");
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});








//get all books

booky.get("/",(req,res)=>{
   return res.json({books:database.books});
})

// get specific specific book

booky.get("/is/:isbn",(req,res)=>{
    const  getSpecificBook = database.books.filter(
        (book)=>book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length === 0){
        return res.json({error:`No bbok found for the ISBN of ${req.params.isbn}`})
    }
  
    return res.json({book:getSpecificBook});

});

//To get list of books based on category

booky.get("/c/:category",(req,res)=>{
    const  getSpecificBook = database.books.filter(
        (book)=>book.category.includes(req.params.category))

    if(getSpecificBook.length === 0){
       return res.json({error:`No book found for the category of ${req.params.category}`})
    }
    
return res.json({book: getSpecificBook});

});


//  To get list of books based on languages

booky.get("/l/:language",(req,res)=>{
    const  getSpecificBook = database.books.filter(
        (book)=>book.language.includes(req.params.language))

    if(getSpecificBook.length === 0){
       return res.json({error:`No book found for the  of ${req.params.language}`})
    }
    
return res.json({book: getSpecificBook});

});

//  To get all the authors

booky.get("/author",(req,res)=>{
    return res.json({authors:database.author});
 });

 //  To get the specific author

 booky.get("/author/:id",(req,res)=>{
    const authorId = parseInt( req.params.id);
    const getSpecificAuthor = database.author.filter(
        (author)=>author.id === authorId
    );

    if(getSpecificAuthor.length === 0){
        return res.json({error:`No author found for the id  of${req.params.id}`})
    }
    return res.json({author:getSpecificAuthor});
    
    });

 //To get list of authors based on books.
 booky.get("/author/book/:isbn",(req,res)=>{
    const  getSpecificAuthors = database.author.filter(
        (author)=>author.books.includes(req.params.isbn)
        );
    if(getSpecificAuthors.length === 0){
       return res.json({error:`No author found for the  of ${req.params.isbn}`});
    }
    
return res.json({author: getSpecificAuthors});

}); 


//To get all the publications 

booky.get("/publications",(req,res)=>{
    return res.json({publications:database.publication});
 });

 //  To get the specific publications

 booky.get("/publications/:id",(req,res)=>{
    const publicationId = parseInt( req.params.id);
    const getSpecificPublication = database.publication.filter(
        (publication)=>publication.id === publicationId
    );

    if(getSpecificPublication.length === 0){
        return res.json({error:`No publication found for the id  of${req.params.id}`})
    }
    return res.json({publication:getSpecificPublication});
    
    });

//To get list of publications based on books.
booky.get("/publications/book/:isbn", (req, res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );

    if (getSpecificPublication.length === 0) {
        return res.json({ error: `No publication found for the ISBN of ${req.params.isbn}` });
    }

    return res.json({ publications: getSpecificPublication });
});




//POST
/*
Route           /
Description     Get all the books
Access          PUBLIC
Parameter       NONE
Methods         GET
 */

//POST - books

booky.post("/book/new",(req,res)=>{
    const newBook = req.body; 
    database.books.push(newBook);
    return res.json({updatedBooks:database.books});
})

//POST- author
/*
Route           /author/new
Description     Get all the authors
Access          PUBLIC
Parameter       NONE
Methods         GET
 */
booky.post("/author/new",(req,res)=>{
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json({updatedAuthor:database.author});
});

//POST - publication
/*
Route           /publication/new
Description     Get all the publications
Access          PUBLIC
Parameter       NONE
Methods         POST
 */

booky.post("/publication/new",(req,res)=>{
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json({updatedAuthor:database.publication});
});


//.....PUT
//update book details if author is changed.
/*
Route           /publication/update/book/:isbn
Description     update or add new publication
Access          PUBLIC
Parameter       isbn
Methods        PUT

 */

booky.put("/publication/update/book/:isbn",(req,res)=>{
   //update the publication database 
    database.publication.forEach((pub)=>{
        if(pub.id === req.body.pubId){
            return pub.books.push(req.params.isbn);
        }
        
    });
   //update the book database
   database.books.forEach((book)=>{
    if(book.ISBN === req.params.isbn){
         book.publications = req.body.pubId;
         return ;
    }
   });
   return res.json(
    {
        books:  database.books,
        publications:   database.publication,
        message:   "Successfully updated publications"
    }
   )
});

/********DELETE******** */
/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameter       isbn
Methods         DELETE
 */
booky.delete("/book/delete/:isbn",(req,res)=>{
      
    const updatedBooksDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )
    database.books = updatedBooksDatabase;

    return res.json({books:database.books});
});

//delete a Author from book
/*
Route           /author/delete/:id
Description     delete a author
Access          PUBLIC
Parameter       id
Methods         DELETE
 */

booky.delete("/book/delete/author/:authorId",(req,res)=>{
    const authorIdToDelete = parseInt(req.params.authorId)
    const updatedAuthorsDatabase = database.author.filter(
        (eachauthor) => eachauthor !== authorIdToDelete
    )
    database.author = updatedAuthorsDatabase;

    return res.json({author:database.author});
});

//3.DELETE AUTHOR FROM BOOK AND RELATED BOOK FROM AUTHOR
/*
Route           /book/delete/author
Description     delete a author and rel book
Access          PUBLIC
Parameter       isbn,authorId
Methods         DELETE
 */

booky.delete("/book/delete/author/:isbn/:authorId" ,(req,res)=>{
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn){
            const authorList = book.author.filter(
                (eachAuthor)=>eachAuthor !== parseInt(req.params.authorId)
            );
            books.author=authorList;
            return ;
        }
    
    });
    //author
    database.author.forEach((eachAuthor)=>{
        if(eachAuthor.id === parseInt(req.params.authorId)){
            const BookList = eachAuthor.books.filter(
                (book)=>book !== req.params.isbn
            );
            eachAuthor.books=  BookList;
            return ;
        }
    });
    return res.json({
        book: database.books,
        author:database.author,
        message:"Author was deleted!!!"
    });
});


booky.set('port', (process.env.PORT || 3000));
booky.listen(booky.get('port'), function() {
    console.log('Server started on port '+booky.get('port'));
});