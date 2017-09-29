const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/User');
const isLoggedIn = require('../middleware/auth');

module.exports = app => {
  app.get('/user', isLoggedIn, (req, res) => {
    console.log(req.user);
    res.render('edit');
  });

  app.post('/user', isLoggedIn, async (req, res) => {
    const user = await User.findOne({ username: req.user.username });

    User.update(
      { username: req.user.username },
      {
        $set: {
          city: req.body.city,
          state: req.body.state
        }
      },
      (err, affected) => {
        if (err) {
          console.log(err);
        } else {
          console.log(affected);
          res.render('edit');
        }
      }
    );
  });
};
