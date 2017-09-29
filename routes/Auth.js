const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy(User.authenticate()));

module.exports = app => {
  app.get('/signup', (req, res) => {
    res.render('signup');
  });

  app.get('/login', (req, res) => {
    res.render('login');
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.post('/login', passport.authenticate('local'), (req, res) => {
    res.redirect('/books');
  });

  app.post('/signup', (req, res) => {
    const newUser = new User({
      username: req.body.username,
      city: req.body.city,
      state: req.body.state
    });
    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
        return res.render('signup');
      }
      passport.authenticate('local')(req, res, function() {
        res.redirect('/books');
      });
    });
  });
};
