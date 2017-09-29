const expres = require('express');

module.exports = function isLoggedin(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/');
  }
};
