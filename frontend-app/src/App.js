import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/hoc/PrivateRoute";
import { routesList } from "./routes/routesList";

const routeTypes = { public: "public", private: "private" };

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          {routesList?.map((route, index) =>
            route?.routeType === routeTypes.public ? (
              <Switch>
                <Route
                  exact={true}
                  path={route.path}
                  component={route.component}
                />
              </Switch>
            ) : (
              <Switch>
                <PrivateRoute
                  exact={true}
                  path={route.path}
                  component={route.component}
                />
              </Switch>
            )
          )}
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
