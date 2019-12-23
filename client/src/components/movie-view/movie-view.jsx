
import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

export class MovieView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { movie } = this.props;
    if (!movie) return null;
    return (
      <div
        className="container-fluid align-items-center ml-3 mt-2"
        style={{ width: "660px" }}
      >
        <div className="movie-title">
          <h1 className="value">{movie.Title}</h1>
        </div>
        <img
          className="movie-poster"
          src="http://via.placeholder.com/640x360"
        />
        <div className="movie-description">
          <div className="mt-1 mb-3">{movie.Description}</div>
        </div>
        <div className="movie-genre">
          Genre:
          <Link to={`/genres/${movie.Genre.Name}`}>
            <Button variant="link">{movie.Genre.Name}</Button>
          </Link>
        </div>
        <div className="movie-director">
          Director:
          <Link to={`/directors/${movie.Director.Name}`}>
            <Button variant="link">{movie.Director.Name}</Button>
          </Link>
        </div>
        <Link to={`/`}>
          <Button className="mt-3" variant="primary">
            Back to Movies
          </Button>
        </Link>
      </div>
    );
  }
}