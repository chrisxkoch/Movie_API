import React from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import './movie-view.scss'

import { Link } from "react-router-dom";

export function MovieView(props) {

  const { movie } = props;
  if (!movie) return null;

  function handleSubmit(event) {
    event.preventDefault();
    axios.post(`https://myflixdb-1988.herokuapp.com/users/${localStorage.getItem('user')}/Favourites/${movie._id}`, {
      Username: localStorage.getItem('user')
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        console.log(response);
        alert('Movie has been added to your Favorite List!');
      })
      .catch(event => {
        console.log('error adding movie to list');
        alert('Ooooops... Something went wrong!');
      });
  };

  return (
    <Card className="movie-view" style={{ width: '45rem' }}>
      <span> <img className="movie-poster" src={movie.ImageUrl} />

        <Card.Body>
          <Card.Title className="movie-title">{movie.Title}</Card.Title>
          <Card.Text>{movie.Description}</Card.Text>
          <ListGroup className="list-group-flush" variant="flush">
            <ListGroup.Item> <p className="movie-info">Genre: {movie.Genre.Name}</p>
              <Link className="text-center" to={`/genres/${movie.Genre.Name}`}>
                <Button variant="outline-dark" size="sm">Learn more</Button>
              </Link>
            </ListGroup.Item>
            <ListGroup.Item> <p className="movie-info">Director: {movie.Director.Name}</p>
              <Link className="text-center" to={`/directors/${movie.Director.Name}`}>
                <Button variant="outline-dark" size="sm">Learn more</Button>
              </Link>
            </ListGroup.Item>
          </ListGroup>
          <div className="text-center">
            <Button variant="outline-secondary" onClick={event => handleSubmit(event)}> Add to Favourites </Button>
            <Link to={`/`}>
              <Button className="button-back" variant="outline-info">MOVIES</Button>
            </Link>
          </div>
        </Card.Body>
      </span>
    </Card>
  );
}
