const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

const session = require('express-session'); // sesiones,
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const { url, db, port } = require('./config');
// ...other code
mongoose.connect(`mongodb://${url}:${port}/${db}`, { useMongoClient: true });
mongoose.Promise = global.Promise;

const auth = require('./routes/auth');
const index = require('./routes/index');
const users = require('./routes/users');

const app = express();
// view engine setup
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
  secret: 'ironhack',
  cookie: { maxAge: 360000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
  resave: false,
  saveUninitialized: false,
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', auth);
app.use('/', index);
app.use('/users', users);



// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
