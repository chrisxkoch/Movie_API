const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const cors = require("cors");
const passport = require("passport");
require('./passport');
var allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://myflixbysophie.herokuapp.com'];


mongoose.set('useFindAndModify', false);
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect('mongodb+srv://myFlixDBadmin:Zeropunk71!@myflixdb-f1pbl.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });
// Middleware functions
app.use(express.static("public"));
app.use(morgan("common")); // Logging with Morgan
app.use(bodyParser.json()); // Using bodyParser
app.use(cors()); // Using cors

var auth = require("./auth")(app);

//Error handling middleware functions
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
  next();
});

const { check, validationResult } = require('express-validator');

// Homepage

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

// Add new Movie
app.post("/movies",
  (req, res) => {
    Movies.findOne({ Title: req.body.Title })
      .then((movie) => {
        if (movie) {
          return res.status(400).send(req.body.Title + " already exists");
        } else {
          Movies.create({
            Title: req.body.Title,
            Description: req.body.Description,
            Genre: req.body.Genre,
            Director: req.body.Director,
            Imagepath: req.body.Imagepath
          })
            .then((movie) => {
              res.status(201).json(movie);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Update Movie
app.put(
  "/movies/:Title",
  (req, res) => {
    Movies.findOneAndUpdate(
      { Title: req.params.Title },
      {
        $set: {
          Title: req.body.Title,
          Description: req.body.Description,
          Genre: req.body.Genre,
          Director: req.body.Director,
          ImagePath: req.body.ImagePath
        }
      },
      { new: true }, // This line makes sure that the updated document is returned
      (error, updatedMovie) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error: " + error);
        } else {
          res.json(updatedMovie);
        }
      }
    );
  }
);

// Gets the list of data about ALL movies
app.get(
  "/movies",
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Gets the data about a single movie, by title
app.get(
  "/movies/:Title", passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Get data about a movie genre, by name
app.get(
  "/movies/genres/:Genre",
  passport.authenticate("jwt", { session: false }),

  (req, res) => {
    Movies.findOne({
      "Genre.Name": req.params.Genre
    })
      .then((movies) => {
        res.json(movies.Genre);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Get data about a director
app.get(
  "/movies/directors/:Name",
  passport.authenticate("jwt", { session: false }),

  (req, res) => {
    Movies.findOne({
      "Director.Name": req.params.Name
    })
      .then((movies) => {
        res.json(movies.Director);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);
// Get Single User
app.get(
  "/users/:Username", passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);
// Add a user
app.post("/users",
  [
    check('Username', 'Not valid').isAlphanumeric(),
    check('Password').exists(),
    check('Email').normalizeEmail().isEmail()
  ],
  (req, res) => {
    // check validation object for errors
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    var hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Update the user's information
app.put(
  "/users/:Username",
  [
    check('Username', 'Not valid').isAlphanumeric(),
    check('Password').exists(),
    check('Email').normalizeEmail().isEmail()
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {


    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }, // This line makes sure that the updated document is returned
      (error, updatedUser) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error: " + error);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Add a movie to a user's list of favorites
app.post(
  "/users/:Username/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),

  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true }, // This line makes sure that the updated document is returned
      (error, updatedUser) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error: " + error);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Remove a movie from user's list of favorites
app.delete(
  "/users/:Username/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }, // This line makes sure that the updated document is returned
      (error, updatedUser) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error: " + error);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Delete a user by username
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),

  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Listen for requests on port 8080

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function () {
  console.log("Listening on Port 3000");
});