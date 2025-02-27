import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col md={6}>
            <h3 className="footer-title" style={{ textAlign: 'left' }}>Casino Adwall</h3>
            <p className="footer-description" style={{ textAlign: 'left' }}>
              Your ultimate guide to the best online casinos,<br />
              bonuses, and promotions.<br />
              Find the perfect casino for your gaming needs.
            </p>
          </Col>
          <Col md={6}>
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/casinos" className="footer-link">
                  All Casinos
                </Link>
              </li>
              <li>
                <Link to="/new-casinos" className="footer-link">
                  New Casinos
                </Link>
              </li>
              <li>
                <Link to="/top-payment" className="footer-link">
                  Top P&P
                </Link>
              </li>
              <li>
                <Link to="/giveaways" className="footer-link">
                  Giveaways
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Casino Adwall - All Rights Reserved | Affiliate: ysivitonen95
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
