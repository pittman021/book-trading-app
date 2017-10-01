const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const seedDb = require('./seed');
const methodOverride = require('method-override');
const keys = require('./config/auth');

const app = express();

app.use(
  require('express-session')({
    secret: 'tim loves tacos',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.use(methodOverride('_method'));
// seedDb();

// PASSPORT CONFIG /

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MONGOOSE  //

mongoose.connect(keys.mongo_URI);

require('./routes/index')(app);
require('./routes/Books')(app);
require('./routes/Auth')(app);
require('./routes/User')(app);
require('./routes/Swap')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('server started');
});
