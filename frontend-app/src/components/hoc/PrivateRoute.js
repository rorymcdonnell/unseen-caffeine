import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const userInfo = localStorage.getItem("userInfo");
  return (
    <Route
      {...rest}
      render={(props) => {
        // check if route is restricted by role
        if (!userInfo && !userInfo?.token) {
          // role not authorised so redirect to home page and logout
          return <Redirect to="/" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
