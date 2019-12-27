<<<<<<< HEAD
import React, { useState } from 'react';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './registration-view.scss'
import cameraLogo from '/images/camera_icon.svg';

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    axios.post('https://myflixdb-1988.herokuapp.com/users', {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday
    })
      .then(response => {
        const data = response.data;
        console.log(data);
        window.open('/', '_self'); // the second argument '_self' is necessary so that the page will open in the current tab
      })
      .catch(e => {
        console.log('error registering the user')
      });
  };

  return (
    <Form className="registration-form">
      <img className="camera-logo" src={cameraLogo} />
      <h4>Register to join myFlix:</h4>
      <Form.Group controlId="formNewUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Your username" value={username} onChange={e => setUsername(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Your Password" value={password} onChange={e => setPassword(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
          </Form.Text>
      </Form.Group>
      <Form.Group controlId='formBirthday'>
        <Form.Label>Birthday</Form.Label>
        <Form.Control type='date' placeholder='MM/DD/YYYY' value={birthday} onChange={e => setBirthday(e.target.value)} />
      </Form.Group>
      <div className="text-center">
        <Button className="button-register" variant="info" type="submit" onClick={handleRegister} >
          Register
      </Button>
      </div>
    </Form >
  );
}
=======
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// imports for files to bundle
import './registration-view.scss';

export function RegistrationView(props) {
  const [ name, setName ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ birthday, setBirthday ] = useState('');
  const [ validated, setValidated] = useState(false);

  const formField = (label, value, onChange, type='text', feedback) => {
    if (!feedback) {
      feedback = `Please insert your ${label.toLowerCase()}.`;
    }
    return (
      <Form.Group controlId="formBasicUsername">
        <Form.Label>{label}</Form.Label>
        <Form.Control 
          type={type}
          value={value}
          onChange={ e => onChange(e.target.value)}      
          required
          placeholder={`Enter ${label.toLowerCase()}`} />
        <Form.Control.Feedback type="invalid">
          {feedback}
        </Form.Control.Feedback>            
      </Form.Group>
    );
  }

  const handleSubmit = (e) => {

    e.preventDefault();

    // handles form validation
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      console.log('new registration', username, 'with password', password);
      // this is temporary, always accept username/password
      props.onNewUserRegistered(username);      
    }
    // notify that fields were validated,
    // therefore feedback can be shown
    // (otherwise it will appear at page load)
    setValidated(true);
  };

  return (
    <div className="registration-view">
      <Row className="justify-content-center">
        <Col xs={11} sm={8} md={6} className="form-container">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {formField('Name', name, setName)}
            {formField('Username', username, setUsername)}
            {formField('Password', password, setPassword, 'password')}
            {formField('Email', email, setEmail, 'email', 'Please provide a valid email address.')}
            {formField('Birthday', birthday, setBirthday, 'date', 'Please provide a valid date (e.g. 01/01/1970).')}

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

RegistrationView.propTypes = {
  onNewUserRegistered: PropTypes.func.isRequired
};
>>>>>>> b75f8a2ebb77f50d284f258fcc2a418b0847c0c9
