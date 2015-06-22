var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// passport authentication and session persistence
var session = require('cookie-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

require('mongoose').connect('mongodb://localhost/test', function(err) {
  if (err) console.log('Failed to connect to mongodb...');
  else console.log('Connected to mongodb');
});

var routes = require('./routes/index');
var users = require('./routes/users');
var access = require('./routes/access');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

var key1 = uuid();
var key2 = uuid();
var key3 = uuid();
var key4 = uuid();
var key5 = uuid();

app.use(session({ keys: [key1, key2, key3, key4, key5]}));
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
var Account = require('./models/account_model');
//passport.use(new LocalStrategy(Account.authenticate()));
passport.use(Account.createStrategy());

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use('/', routes);
app.use('/users', users);
app.use('/access', access);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

module.exports = app;
