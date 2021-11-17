import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/hoc/PrivateRoute";
import { routesList } from "./routes/routesList";
import PageNotFound from "./screens/PageNotFound";

const routeTypes = { public: "public", private: "private" };

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Switch>
            {routesList?.map((route, index) =>
              route?.routeType === routeTypes.public ? (
                <Route
                  exact={true}
                  path={route.path}
                  component={route.component}
                />
              ) : (
                <PrivateRoute
                  exact={true}
                  path={route.path}
                  component={route.component}
                />
              )
            )}
            <Route component={PageNotFound} />
          </Switch>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
