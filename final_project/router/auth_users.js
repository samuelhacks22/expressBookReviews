const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = username => {
	//returns boolean
	//write code to check is the username is valid
	let registeredUser = users.filter(user => {
		return user.username === username;
	});

	let filteredUser =
		registeredUser.length > 0 ? true : false;

	return filteredUser;
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	let user = users.filter(currentUser => {
		return (
			currentUser.username === username &&
			currentUser.password === password
		);
	});

	if (user.length > 0) {
		return true;
	} else {
		return false;
	}
};

//only registered users can login
regd_users.post('/login', (req, res) => {
	//Write your code here
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res
			.status(404)
			.json({ message: 'Invalid username or password' });
	}

	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign(
			{ data: password },
			'access',
			{ expiresIn: 60 * 60 * 60 }
		);

		req.session.authorization = {
			accessToken,
			username,
		};

		res.status(200).send('User successfully logged in');
	} else {
		res.status(208).json({
			message: 'Invalid Login. Check username and password',
		});
	}
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
	//Write your code here
	const isbn = req.params.isbn;
	const userReview = req.query.review;
	const username = req.session.authorization.username;

	if (!username) {
		res
			.status(401)
			.send('You must login to submit a review');
	}

	if (!books[isbn]) {
		res
			.status(404)
			.send(
				'Book not found. Please enter the correct isbn'
			);
	}

	books[isbn].reviews[username] = userReview;

	res.send(
		`Your review for the book with ISBN ${isbn} has been added`
	);
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn;
	const username = req.session.authorization.username;

	if (!username) {
		res
			.status(401)
			.send('You must login to delete a review');
	}

	if (!books[isbn]) {
		res
			.status(404)
			.send(
				'Book not found. Please enter the correct isbn'
			);
	}

	if (books[isbn].reviews[username]) {
		delete books[isbn].reviews[username];
		res.send(
			`Your review for book with ISBN ${isbn} has been deleted.`
		);
	} else {
		res.status(404).send('You have not reviewed this book');
	}
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;