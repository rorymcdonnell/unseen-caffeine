import React from "react";
import { Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import SearchBox from "./SearchBox";
import { logout } from "../actions/userActions";
import logo from "../images/uc-logo.png";

const Header = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <div className="banner-container">
        <p className="header-banner">RECEIVE DISCOUNT, NEWS & MORE - </p>
        <a href="#">
          <p className="header-banner join-family">JOIN THE FAMILY</p>
        </a>
      </div>

      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Route render={({ history }) => <SearchBox history={history} />} />
            <Nav className="ml-auto">
              <LinkContainer to="/cart">
                <Nav.Link className="cart-with-word">
                  <i className="fas fa-shopping-cart "></i> Cart
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/subscriptionlist">
                    <NavDropdown.Item>Subscriptions</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
          <LinkContainer to="/shop">
            <Nav.Link className="shop-nav">Shop</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/subscriptions">
            <Nav.Link className="shop-nav">Subscriptions</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/merchandise">
            <Nav.Link className="shop-nav">Merchandise</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/">
            <Nav.Link>
              <img className="logo" src={logo} alt="logo"></img>
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/cart">
            <Nav.Link>
              <i className="fas fa-shopping-cart fa-3x"></i>
            </Nav.Link>
          </LinkContainer>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
