const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
	//Write your code here
	const username = req.body.username;
	const password = req.body.password;

	if (username && password) {
		if (!isValid(username)) {
			users.push({
				username,
				password,
			});
			return res.send({ message: 'User registered' });
		} else {
			return res
				.status(404)
				.json({ message: 'User already exists!' });
		}
	}
	res
		.status(404)
		.json({ message: 'Unable to register user' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
	//Write your code here
	res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
	//Write your code here
	const isbn = req.params.isbn;
	res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
	//Write your code here
	let keys = Object.keys(books);

	keys.map(key => {
		if (books[key].author === req.params.author) {
			res.send(books[key]);
		}
	});
	res.status(404).json({ message: 'Author not found' });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
	//Write your code here
	let keys = Object.keys(books);

	keys.map(key => {
		if (books[key].title === req.params.title) {
			res.send(books[key]);
		}
	});
	res.status(404).json({ message: 'Book not found' });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
	//Write your code here
	const isbn = req.params.isbn;
	res.send(books[isbn].review);
});

module.exports.general = public_users;