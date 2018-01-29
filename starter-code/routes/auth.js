var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;


const User = require('../models/user');
/* GET home page. */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const {username, password, name, email } = req.body;
  if (username === '' || password === ''|| name === ''|| email === ''){
    const error = 'Todos los campos son obligatorios';
    res.render('auth/signup', { error });
  } else {
    User.findOne({ username })
    .then((user) => {
      if (!user) {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hastPass = bcrypt.hashSync(password, salt);
        const newUser = {
          username,
          password: hashPass,
          name,
          email,
        };
        User.create(newUser)
        .then((doc) => {
          res.redirect('/');
        })
        .catch((err) => {
          const error = 'Problema al crear el usuario';
          res.render('auth/signup', { error });
        });
      } else {
        const error = 'Usuario ya existente';
        res.render('auth/signup', { error });
      }
    })
  }
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  const {username, password, name, email } = req.body;
  if (username === '' || password === ''|| name === ''|| email === ''){
    const error = 'Todos los campos son obligatorios';
    res.render('auth/login', { error });
  } else {
    User.findOne({ username })
    .then((user) => {
      if (!user) {
        const error = 'Usuario y password incorrectos';
        res.render('auth/login', { error });
      } else if (bcrypt.compareSync(password, user.password)){
        req.session.currentUser = user._id;
        res.redirect('/profile');
      } else {
        const error = 'Usuario y password incorrectos';
        res.render('auth/login', { error });
      }
    });
  }
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.redirect('/login');
    }
  });
});


module.exports = router;
