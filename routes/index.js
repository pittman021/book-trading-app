const express = require('express');

module.exports = app => {
  app.get('/', (req, res) => {
    res.render('home');
  });
};
