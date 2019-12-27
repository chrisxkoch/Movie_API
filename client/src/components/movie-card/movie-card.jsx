<<<<<<< HEAD
import React from 'react';

import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './movie-card.scss'

import { Link } from "react-router-dom";

export class MovieCard extends React.Component {
  render() {
    const { movie } = this.props;

    return (
      <Card style={{ width: '14rem', height: '41rem' }}>
        <Card.Img variant="top" src={movie.ImagePath} />
        <Card.Body>
          <Card.Title className="movie-title">{movie.Title}</Card.Title>
          <Card.Text>{movie.Description}</Card.Text>
          <Link to={`/movies/${movie._id}`}>
            <Button className="button-card" variant="info">Open</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string,
    Description: PropTypes.string,
    ImageUrl: PropTypes.string
  }).isRequired
=======
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const MAX_CHARS_IN_A_DESCRIPTION = 100;

export class MovieCard extends React.Component {
  render() {
    const { movie, onClick } = this.props;
    let movieDescription = movie.Description;
    if (movieDescription.length > MAX_CHARS_IN_A_DESCRIPTION) {
      movieDescription = `${movieDescription.substring(0, MAX_CHARS_IN_A_DESCRIPTION)}...`;
    }
    return (
      <Card className="mb-3 mb-sm-4" style={{ minWidth: '12rem' }}>
        <Card.Img variant="top" src={movie.ImagePath} />
        <Card.Body>
          <Card.Title>{movie.Title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{movie.Genre.Name}</Card.Subtitle>
          <Card.Text>{movieDescription}</Card.Text>
          <Button className="outline-primary" onClick={() => onClick(movie)} variant="link">Open</Button>
        </Card.Body>
      </Card>
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string,
    ImagePath: PropTypes.string,
    Genre: PropTypes.exact({
      _id: PropTypes.string,
      Name: PropTypes.string,
      Description: PropTypes.string
    })
  }).isRequired,
  onClick: PropTypes.func.isRequired
>>>>>>> b75f8a2ebb77f50d284f258fcc2a418b0847c0c9
};