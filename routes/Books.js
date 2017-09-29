const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const axios = require('axios');
const isLoggedIn = require('../middleware/auth');
const Swap = require('../models/Swap');

module.exports = app => {
  app.get('/books/new', isLoggedIn, (req, res) => {
    res.render('books/new', { books: '' });
  });

  app.get('/books/:id', async (req, res) => {
    const foundUser = await User.findById(req.params.id).populate('books');
    const borrowRequest = await Swap.find({
      requester: req.params.id
    })
      .populate('requester')
      .populate('book');

    const lendRequest = await Swap.find({ owner: req.params.id }).populate(
      'book'
    );
    res.render('books/show', {
      books: foundUser.books,
      borrowRequest: borrowRequest,
      lendRequest: lendRequest
    });
  });

  app.get('/books', (req, res) => {
    Book.find({}).then(books => {
      res.render('books', { books: books });
    });
  });

  app.post('/books/search', isLoggedIn, (req, res) => {
    const title = req.body.title;
    const key = 'AIzaSyB2KFVC3JmGax2v19K4jDLVelv91IpOkoI';
    axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${title}&maxResults=10&key=${key}`
      )
      .then(data => {
        const bookArray = [];
        const items = data.data.items;
        items.forEach(i => {
          // checking of image array in item, not always provided.
          if (i.volumeInfo.imageLinks) {
            const book = {
              id: i.id,
              title: i.volumeInfo.title,
              image: i.volumeInfo.imageLinks.thumbnail
            };
            bookArray.push(book);
          }
        });
        res.render('books/new', { books: bookArray });
      });
  });

  app.post('/books/:id/borrow', isLoggedIn, async (req, res) => {
    const foundBook = await Book.findOne({ _id: req.params.id });

    const newSwap = new Swap({
      book: foundBook.id,
      owner: foundBook.owner,
      requester: req.user.id,
      status: 'Pending'
    });

    newSwap.save().then(err => {
      console.log('book borrow requested');
      res.redirect('/books');
    });
  });

  app.post('/books', isLoggedIn, async (req, res) => {
    const newBook = new Book({
      title: req.body.name,
      image: req.body.image,
      owner: req.user.id
    });
    newBook.save(err => {
      if (err) console.log(err);
    });

    const user = await User.findOne({ username: req.user.username });
    user.books.push(newBook);
    user.save(err => {
      if (err) console.log(err);
    });
    res.redirect('/books');
  });
};
