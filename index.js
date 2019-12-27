////////////////REQUIRED MODULES/////////////////////
const path = require("path");
const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const uuid = require("uuid");
const mongoose = require('mongoose');
const cors = require('cors');
const validator = require('express-validator');
const passport = require('passport');
const Models = require('./models.js');

require('./passport');

//creating variable to use express functionality
const app = express();

//assign the modules
const Movies = Models.Movie;
const Users = Models.User;

/////////////CONNECT TO MONGODB//////////////////

//connecting Mongoose to the database
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

/////////////MIDDLEWARE FUNCTIONS////////////////

//logs requests using Morgan’s “common” format
app.use(morgan('common'));

app.use(express.static('public'));
app.use('/client', express.static(path.join(__dirname, 'dist')));
app.get("/client/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

//implementing body-parser for POST requests
app.use(bodyParser.json());

//implementing cors & enabling it for all origins
app.use(cors());

/* code for cors to give access only to certain domains:

var allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      var message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));
*/

//importing auth.js file
var auth = require('./auth')(app);

//use express-validator
app.use(validator());

/////////////////MOVIE REQUESTS////////////////

//Gets the list of ALL movies
app.get('/movies', passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

//Gets the data about a single movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.findOne({ Title: req.params.Title })
    .then(function (movies) {
      res.json(movies)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

//Get the genre of a single movie based on its title
app.get('/movies/genres/:Title', passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.findOne({ Title: req.params.Title })
    .then(function (movie) {
      if (movie) {
        res.status(201).send("Movie with the title : " + movie.Title + " is  a " + movie.Genre.Name + " .");
      } else {
        res.status(404).send("Movie with the title : " + req.params.Title + " was not found.");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

//Gets the data about a director by name
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.findOne({ "Director.Name": req.params.Name })
    .then(function (movies) {
      res.json(movies.Director)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

///////////////////USER REQUESTS/////////////////////

//Creates new user profile
app.post('/users', function (req, res) {
  req.checkBody('Username', 'Username is required').notEmpty();
  req.checkBody('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric()
  req.checkBody('Password', 'Password is required').notEmpty();
  req.checkBody('Email', 'Email is required').notEmpty();
  req.checkBody('Email', 'Email does not appear to be valid').isEmail();

  // check the validation object for errors
  var errors = req.validationErrors();
  if (errors) {
    return res.status(422).json({ errors: errors });
  }

  var hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then(function (user) {
      if (user) {
        //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + " already exists");
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then(function (user) { res.status(201).json(user) })
          .catch(function (error) {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    }).catch(function (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//Gets user profile by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOne({ Username: req.params.Username })
    .then(function (user) {
      res.json(user)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

// Updates user profile
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
  req.checkBody('Username', 'Username is required').notEmpty();
  req.checkBody('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric()
  req.checkBody('Password', 'Password is required').notEmpty();
  req.checkBody('Email', 'Email is required').notEmpty();
  req.checkBody('Email', 'Email does not appear to be valid').isEmail();

  // check the validation object for errors
  var errors = req.validationErrors();
  if (errors) {
    return res.status(422).json({ errors: errors });
  }

  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true },//ensures updated user profile is returned
    function (err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error:" + err);
      } else {
        res.json(updatedUser)
      }
    });
});

// Adds movie to the users list of favourites
app.post('/users/:Username/Favourites/:MovieID', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $addToSet: { Favourites: req.params.MovieID }
  },
    { new: true },
    function (err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error:" + err);
      } else {
        res.json(updatedUser)
      }
    })
});

// Removes movie from the users list of favourites
app.delete('/users/:Username/Favourites/:MovieID', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { Favourites: req.params.MovieID }
  },
    { new: true },
    function (err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error:" + err);
      } else {
        res.json(updatedUser)
      }
    });
});

// Deletes user account by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then(function (user) {
      if (!user) {
        res.status(400).send("Account with the username: " + req.params.Username + " was not found .");
      } else {
        res.status(200).send("Account with the username : " + req.params.Username + " was successfully deleted.");
      }
    })
    .catch(function (err) {
      console.error(err.stack);
      res.status(500).send("Error: " + err);
    });
});

//Shows all the users for testing purposes
app.get('/users', function (req, res) {
  Users.find()
    .then(function (users) {
      res.status(201).json(users);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// default textual response when request hits the root folder
app.get('/', function (req, res) {
  res.send('Welcome to myFlix!');
});

////////////////APP LISTENER///////////////

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function () {
  console.log(`Listening on Port ${port}`);
});
