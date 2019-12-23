import React, { useState } from "react";
import "./login-view.scss";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import logo from "../../images/logo2.png";
import { Link } from "react-router-dom";

export function LoginView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    /* Send a request to the server for authentication */
    axios
      .post("https://myflixdb-1988.herokuapp.com/login", {
        Username: username,
        Password: password
      })
      .then((response) => {
        const data = response.data;
        props.onLoggedIn(username);
      })
      .catch((e) => {
        console.log("no such user");
      });
  };

  return (
    <Form className="login-form">
      <img src={logo} alt="logo" style={{ width: "300px" }} />
      <Form.Group controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="username"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Button
        variant="btn-lg btn-dark btn-block"
        type="submit"
        onClick={handleSubmit}
      >
        Login
      </Button>
    </Form>
  );
}
