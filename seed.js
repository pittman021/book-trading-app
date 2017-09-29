const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');

function seedDB() {
  // remove all books //
  Book.remove({}, function(err, book) {
    if (err) {
    } else {
      console.log('books removed');
      // Find tim in the DB //
      // Remove all of this books //
      User.findOne({ username: 't' }, (err, tim) => {
        if (err) {
          console.log(err);
        } else {
          // creating new book //
          const newbook = new Book({
            title: 'Farewell to Arms',
            image:
              'http://books.google.com/books/content?id=wS_Bbn_UUcoC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
            owner: tim._id
          });

          // saving the fucking book //
          newbook.save((err, book) => {
            if (err) {
              console.log(err);
            } else {
              console.log('newbook saved');
            }
          });
          // updating tim //
          tim.books = [];
          tim.books.push(newbook);
          tim.save().then(err => {
            if (err) {
              console.log(err);
            } else {
              console.log('tim saved');
            }
          });
        }
      });
    }
  });
}

module.exports = seedDB;
