import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import logo from "../../images/logo2.png";

function MyNavbar() {
  return (
    <Navbar bg="dark" expand="lg">
      <Navbar.Brand href="#">
        <img src={logo} alt="logo" style={{ width: "150px" }} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link className="text-white ml-5">Home</Nav.Link>
          <Nav.Link className="text-white ml-5">Profile</Nav.Link>
          <Nav.Link className="text-white ml-5">Logout</Nav.Link>
        </Nav>
        <Form inline>
          <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-primary" type="submit">
            Search
          </Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MyNavbar;
