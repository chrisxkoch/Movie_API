<<<<<<< HEAD
import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';


import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { setMovies, setLoggedUser } from '../../actions/actions';

import MoviesList from '../movies-list/movies-list';
import { ProfileView } from '../profile-view/profile-view';
import { ProfileUpdate } from '../profile-view/profile-update';
import { RegistrationView } from '../registration-view/registration-view';
import { LoginView } from '../login-view/login-view';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import './main-view.scss'

export class MainView extends React.Component {

  constructor() {
    super();

    this.state = {
      movies: [],
      user: null,
      email: '',
      birthday: '',
      userInfo: {}
    };
  }

  getMovies(token) {
    axios.get('https://myflixdb-1988.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setMovies(response.data);
        localStorage.setItem('movies', JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getUser(token) {
    axios
      .get('https://myflixdb-1988.herokuapp.com/users/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.props.setLoggedUser(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateUser(data) {
    this.setState({
      userInfo: data
    });
    localStorage.setItem('user', data.Username);
  }

  // One of the "hooks" available in a React Component
  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
      this.getUser(accessToken);
    }
  }
  onMovieClick(movie) {
    window.location.hash = '#' + movie._id;
    this.setState({
      selectedMovieId: movie._id
    });
  }

  onLoggedIn(authData) {
    this.setState({
      user: authData.user.Username
    });
    this.props.setLoggedUser(authData.user);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('movies');
    this.setState({
      user: null
    })
    window.open('/', '_self');
  }

  render() {
    const { user, userInfo, token } = this.state;
    let { movies } = this.props;

    // Before the movies have been loaded
    if (!movies) return <div className="main-view" />;

    return (
      <Router basename="/client">
        <Container className="main-view" fluid="true">
          <div className="btn-group">
            <Link to={`/users/${user}`}>
              <Button className="profile-btn" variant="info">
                Profile
             </Button>
            </Link>
            <Button className="logout" variant="info" onClick={() => this.onLogout()} >
              Log out
             </Button>
          </div>
          <Row>
            <Route exact path="/" render={() => {
              if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
              return <MoviesList movies={movies} />;
            }
            } />
            <Route path="/register" render={() => <RegistrationView />} />
            <Route path="/movies/:movieId" render={({ match }) => <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />
            <Route path="/directors/:name" render={({ match }) => {
              if (!movies || !movies.length) return <div className="main-view" />;
              return <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} />
            }
            } />
            <Route path="/genres/:name" render={({ match }) => {
              if (!movies || !movies.length) return <div className="main-view" />;
              return <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} />
            }
            } />
            <Route path="/users/:Username" render={({ match }) => { return <ProfileView userInfo={userInfo} /> }} />
            <Route path="/update/:Username" render={() => <ProfileUpdate userInfo={userInfo} user={user} token={token} updateUser={data => this.updateUser(data)} />}
            />
          </Row>
        </Container>
      </Router>
    );
  }
}

let mapStateToProps = state => {
  return {
    movies: state.movies,
    setLoggedUser: state.setLoggedUser
  }
}

export default connect(mapStateToProps, { setMovies, setLoggedUser })(MainView);
=======
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// get bootstrap imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// get fontawesome imports
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// get app imports
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

const REGISTER_NEW_USER = 'registerNewUser';
const LOGIN_USER = 'login';

export class MainView extends React.Component {
  constructor() {
    // super class constructor
    super();

    // init an empty state
    this.state = {
      movies: null,
      selectedMovie: null,
      user: null,
      userAction: null
    };
  }

  componentDidMount() {
    // let url_root = 'http://localhost:3000'
    let url_root = 'https://myflixdb-1988.herokuapp.com'
    axios.get(`${url_root}/movies`)
      .then(response => {
        // set state with result
        this.setState({
          movies: response.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie,
      userAction: null
    })
  }

  onLoggedIn(user) {
    this.setState({
      user,
      userAction: null
    });
  }

  onNewUserRegistered(user) {
    this.setState({
      user,
      userAction: null
    });
  }

  onRegisterNewUser() {
    this.setState({ userAction: REGISTER_NEW_USER });
  }

  onLoginUser() {
    this.setState({ userAction: LOGIN_USER });
  }

  onClickGoBack() {
    const { selectedMovie, userAction } = this.state;
    // on click, if selectedMovie then null the selectedMovie,
    // otherwise make null only the userAction ("go back" button)    
    if (userAction) {
      this.setState({ userAction: null })
    } else if (selectedMovie) {
      this.setState({ selectedMovie: null })
    }
  }

  renderActionPanelNoUser() {
    return (
      <Form inline className="my-4 my-sm-0 d-flex justify-content-center justify-content-sm-end">
        <Button
          variant="outline-secondary"
          className="mr-2 mr-sm-2"
          onClick={() => this.onLoginUser()}>Log in</Button>
        <span className="mr-2 mr-sm-2">or</span>
        <Button
          variant="primary"
          onClick={() => this.onRegisterNewUser()}>Sign up</Button>
      </Form>
    );
  }

  renderActionPanelUser(user) {
    return (
      <Form inline className="my-4 my-sm-0 d-flex justify-content-center justify-content-sm-end">
        <Navbar.Text>
          Signed in as: <a href="#profile">{user}</a>
        </Navbar.Text>
        <Button
          variant="outline-primary"
          className="ml-3 ml-sm-4"
          onClick={() => this.onLoggedIn(null)}>Log out</Button>
      </Form>
    );
  }

  renderHeader() {
    const { selectedMovie, user, userAction } = this.state;

    let actionPanel = null;
    let navTitle = 'MyFlix';
    // check if user is logged in
    if (!user) {
      if (userAction && userAction === LOGIN_USER) {
        // a log in was requested
        navTitle = 'Log in to MyFlix';
      } else if (userAction && userAction === REGISTER_NEW_USER) {
        // a sign up was requested
        navTitle = 'Register to MyFlix';
      } else {
        // none of the two, show "Log in" and "Sign up" buttons
        actionPanel = this.renderActionPanelNoUser();
      }
    } else {
      actionPanel = this.renderActionPanelUser(user);
    }
    if (selectedMovie && !userAction) {
      navTitle = selectedMovie.Title;
    }
    return (
      <Navbar collapseOnSelect expand="sm" bg="light" variant="light">

        <Navbar.Brand className="mw-80 mw-sm-100 text-truncate">
          {selectedMovie || userAction
            ?
            <React.Fragment>
              <a href="#go-back">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="mr-2 mr-sm-4"
                  onClick={() => this.onClickGoBack()}
                />
              </a>
            </React.Fragment>
            : <FontAwesomeIcon
              icon={faChevronLeft}
              className="mr-2 mr-sm-4 text-light"
            />}

          {navTitle}

        </Navbar.Brand>
        {actionPanel
          ? (
            <React.Fragment>
              <Navbar.Toggle aria-controls="responsive-navbar-nav"></Navbar.Toggle>
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                  {selectedMovie && user && !userAction ? <FontAwesomeIcon icon={faStar} className="ml-2 ml-sm-4" /> : ''}
                </Nav>
                {actionPanel}
              </Navbar.Collapse>
            </React.Fragment>
          )
          : <React.Fragment></React.Fragment>
        }
      </Navbar>
    );
  }

  renderMainContainer(children) {
    return (
      <Container className="mt-5">
        {children}
      </Container>
    );
  }

  renderMainView() {
    const { movies, selectedMovie, user, userAction } = this.state;
    // if movies is not yet loaded
    if (!movies) {
      return (
        <div className="spinner-view">
          <Row className="justify-content-center">
            <Col className="text-center">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <React.Fragment>
        {selectedMovie ?
          (<MovieView
            movie={selectedMovie}
          />)
          : <div className="main-view card-deck">
            {movies.map(movie => (
              <MovieCard
                key={movie._id}
                movie={movie}
                onClick={movie => this.onMovieClick(movie)}
              />
            ))}
          </div>
        }
      </React.Fragment>
    );

  }

  render() {

    const { movies, selectedMovie, user, userAction } = this.state;
    let loginView = <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
    let registrationView = <RegistrationView onNewUserRegistered={user => this.onNewUserRegistered(user)} />;

    // here mainContent can be loginView, registrationView, or mainView
    let mainContent = null;

    // check if user is logged in
    if (!user) {
      // check if a log in was requested
      if (userAction && userAction === LOGIN_USER) {
        mainContent = loginView;
      }
      // check if a sign up was requested
      if (userAction && userAction === REGISTER_NEW_USER) {
        mainContent = registrationView;
      }
    }
    // if no login nor user registration, then main view
    if (!mainContent) {
      mainContent = this.renderMainView();
    }

    // render the whole thing
    return (
      <React.Fragment>
        {this.renderHeader()}
        {this.renderMainContainer(mainContent)}
      </React.Fragment>
    );

  }
}

MainView.propTypes = {
  // so far no props needed
};
>>>>>>> b75f8a2ebb77f50d284f258fcc2a418b0847c0c9
