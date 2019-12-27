<<<<<<< HEAD
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

var Users = Models.User;
var JWTStrategy = passportJWT.Strategy;
var ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  console.log(username + '  ' + password);
  Users.findOne({ Username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }
    if (!user) {
      console.log('incorrect username');
      return callback(null, false, {message: 'Incorrect username.'});
    }
    if (!user.validatePassword(password)) {
      console.log('incorrect password');
      return callback(null, false, {message: 'Incorrect password.'});
    }
    console.log('finished');
    return callback(null, user);
  });
}));

passport.use(new JWTStrategy({
 jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
 secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
 return Users.findById(jwtPayload._id)
 .then((user) => {
   return callback(null, user);
 })
 .catch((error) => {
   return callback(error)
 });
}));
=======
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Users = require('./models/users.js'),
  passportJWT = require('passport-jwt');

let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

if (!process.env.JWT_SECRET) {
  console.error('Environment variables not found.');
}

// LocalStrategy defines your basic HTTP 
// authentication for login requests.
passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  Users.findOne({ Username: username }, (err, user) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    if (!user) {
      return callback(null, false, { message: 'Incorrect username or password.' });
    }
    if (!user.validatePassword(password)) {
      return callback(null, false, { message: 'Incorrect username or password.' });
    }
    return callback(null, user);
  });
}));

// The JWTStrategy allows to authenticate users based on the JWT
// submitted alongside their request.
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, (jwtPayload, callback) => {
  return Users.findById(jwtPayload._id)
    .then( (user) => {
      return callback(null, user);
    })
    .catch( err => {
      return callback(err);
    });
}));
>>>>>>> b75f8a2ebb77f50d284f258fcc2a418b0847c0c9
