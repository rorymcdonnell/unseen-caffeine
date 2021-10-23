import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import logo from "../images/uc-logo.png";

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row className="footer-row">
          <Col>
            <div className="footer-area">
              <img className="uc-logo" src={logo} alt="logo"></img>
            </div>
            <div className="footer-area">
              <p className="footer-text">UNSEEN CAFFEINE LTD</p>
            </div>
            <div className="icon-area">
              <a href="https://www.facebook.com/Unseen-Caffeine-100533935218245">
                <i className="fab fa-facebook-f fa-2x"></i>
              </a>
              <a href="https://www.instagram.com/unseencaffeine/">
                <i className="fab fa-instagram fa-2x"></i>
              </a>
              <a href="https://twitter.com/unseencaffeine?lang=en">
                <i className="fab fa-twitter fa-2x"></i>
              </a>
            </div>
            <div className="footer-menu">
              <ul>
                <li>delivery</li>
                <li>returns</li>
                <li>wholesale</li>
                <li>charity</li>
                <li>contact</li>
              </ul>
            </div>
            <div className="terms-and-privacy">
              <p>terms & conditions</p>
              <p>privacy policy</p>
            </div>
            <div className="corporate">
              <p>©unseen caffeine 2021</p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
