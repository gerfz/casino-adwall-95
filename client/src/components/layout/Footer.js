import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col md={6}>
            <h3 className="footer-title" style={{ textAlign: 'left' }}>About Me</h3>
            <p className="footer-description" style={{ textAlign: 'left' }}>
              With thousands of subscribers, Ysivitonen has become<br />
              a well-known figure in the online casino community.<br />
              He streams his gameplay from different online casinos,<br />
              giving his viewers a chance to see how he plays and what strategies he uses.
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
