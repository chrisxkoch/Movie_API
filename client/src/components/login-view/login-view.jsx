import React, { useState } from 'react';
import axios from 'axios';

import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './login-view.scss'
import cameraLogo from '/images/camera_icon.svg';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    /* Send a request to the server for authentication */
    axios.post('https://myflixdb-1988.herokuapp.com/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch(e => {
        console.log('no such user')
      });
  };

  return (
    <Container>
      <div className="text-center">
        <img className="camera-logo" src={cameraLogo} />
        <h1 className="main-title">Welcome to myFlix!</h1>
      </div>
      <Form className="login-form">
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <div className="text-center">
          <Button className="btn-submit" variant="info" type="submit" onClick={handleSubmit} >
            Log in
        </Button>
          <Link to={`/register`}>
            <Button className="btn-register" variant="secondary">Register</Button>
          </Link>
        </div>
      </Form>
    </Container >
  );
}

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
};