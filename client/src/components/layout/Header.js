import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const Header = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in (from localStorage)
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  
  // Logout handler
  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <header>
      <Navbar expand="lg" variant="dark" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src="/textonlylogo.png"
              alt="Casino Adwall"
              height="60"
              className="d-inline-block align-middle"
              style={{ marginTop: '-5px', marginBottom: '-5px' }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/casinos">
                All Casinos
              </Nav.Link>
              <Nav.Link as={Link} to="/new-casinos">
                New Casinos
              </Nav.Link>
              <Nav.Link as={Link} to="/top-payment">
                Top P&P
              </Nav.Link>
              <Nav.Link as={Link} to="/giveaways">
                Giveaways
              </Nav.Link>
              
              {/* Admin dropdown only shown when user is logged in as admin */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="admin-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/admin">
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/casinos">
                    Casinos
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/banners">
                    Banners
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/giveaways">
                    Giveaways
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {/* Remove the Admin Login link from navbar */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
