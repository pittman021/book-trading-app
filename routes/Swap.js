const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const isLoggedIn = require('../middleware/auth');
const Swap = require('../models/Swap');

module.exports = app => {
  app.post('/swap/:id/accept', async (req, res) => {
    Swap.update({ _id: req.params.id }, { $set: { status: 'Active' } }, err => {
      if (err) {
        console.log(err);
      } else {
        console.log('request updated');
        res.redirect('/books');
      }
    });
  });

  app.post('/swap/:id/reject', async (req, res) => {
    console.log('reject route');
    Swap.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { status: 'Rejected' } },
      err => {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/books');
        }
      }
    );
  });

  app.delete('/swap/:id', isLoggedIn, async (req, res) => {
    Swap.remove({ _id: req.params.id }, err => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/books');
      }
    });
  });

  app.post('swap/:id/return', async (req, res) => {
    console.log('reject route');
    Swap.remove(
      { _id: req.params.id },
      { $set: { status: 'Returned' } },
      err => {
        if (err) {
          console.log(err);
        } else {
          console.log('request rejected');
          res.redirect('/books');
        }
      }
    );
  });
};
