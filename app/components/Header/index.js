import { Link } from 'react-router';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import React, { Component } from 'react';
import styled from 'styled-components';

const NavWrapper = styled.div`
  margin-bottom: 30px;

  .navbar {
    background-color: #222b34;
    border-color: #222b34;
    border-radius: 0;

    .navbar-brand {
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 8px;

      a {
        color: #ff6600 !important;
        text-decoration: none;
      }
    }
  }
`

class Header extends Component {
  render() {
    return(
      <NavWrapper>
        <Navbar inverse collapseOnSelect fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <a><Link to="/">AUGUR</Link></a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1}><Link to='/topology'>Topology Search</Link></NavItem>
              <NavItem eventKey={2}><Link to='/forecast'>Forecast Impact</Link></NavItem>
              <NavDropdown eventKey={3} title="Fault Management" id="basic-nav-dropdown">
                <MenuItem eventKey={3.1}><Link to='/'>Alarm Correlation</Link></MenuItem>
                <MenuItem eventKey={3.2}><Link to='/'>Predict Faults</Link></MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </NavWrapper>
    );
  }
}

export default Header;
