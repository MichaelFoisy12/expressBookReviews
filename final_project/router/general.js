const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // Register a new user
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }
  users.push({ username, password });
  return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // ISBN Number
  const isbn = req.params.isbn;
    
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn], null, 4));
        return res.status(200).json({message: "Book details fetched successfully", book: books[isbn]});
    } else {
        res.status(404).json({message: "Book not found"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
  let booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
  if (booksByAuthor.length > 0) {
    res.send(JSON.stringify(booksByAuthor, null, 4));
    return res.status(200).json({message: "Books by author fetched successfully", books: booksByAuthor});
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
    if (booksByTitle.length > 0) {
      res.send(JSON.stringify(booksByTitle, null, 4));
      return res.status(200).json({message: "Books by title fetched successfully", books: booksByTitle});
    } else {
      return res.status(404).json({message: "No books found with this title"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if(books[isbn] && Object.keys(books[isbn].reviews).length > 0) {
      res.send(JSON.stringify(books[isbn].reviews, null, 4));
      return res.status(200).json({message: "Reviews fetched successfully", reviews: books[isbn].reviews});
    } else { 
      return res.status(404).json({message: "No reviews found for this book"});
    }
});

module.exports.general = public_users;
