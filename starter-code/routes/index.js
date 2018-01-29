var express = require('express');
var router = express.Router();

const User = require('../models/user');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Linkedin' });
});

router.get('/profile',(req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
},(req, res, next) => {
  const userId = req.session.currentUser;

  User.findById(userId)
    .then((user) => {
      res.render('homepage', { username: user.username });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
