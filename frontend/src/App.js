import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";

import "./App.css";
import AuthPage from "./pages/Auth";
import EventsPage from "./pages/Events";
import BookingsPage from "./pages/Bookings";
import MainNav from "./components/Navigation/MainNav";
import AuthContext from "./context/auth-context";

class App extends Component {
  state = {
    token: null,
    userId: null,
    isAuthenticated: false
  };

  login = ({ token, userId, tokenExpiration }) => {
    this.setState({ token, userId, isAuthenticated: true });
  };

  logout = () => {
    this.setState({ token: null, userId: null, isAuthenticated: false });
  };

  render() {
    return (
      <Router>
        <>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              isAuthenticated: this.state.isAuthenticated,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNav />
            <main className="main-content">
              <Switch>
                {/* Protected routes */}
                {!this.state.isAuthenticated && (
                  <Route path="/auth" component={AuthPage} />
                )}
                {this.state.isAuthenticated && (
                  <Route path="/bookings" component={BookingsPage} />
                )}

                {/* Public routes */}
                <Route path="/events" component={EventsPage} />

                {/* Redirection */}
                {!this.state.isAuthenticated && <Redirect to="/auth" exact />}
                {this.state.isAuthenticated && (
                  <Redirect from="/" to="/events" exact />
                )}
                {this.state.isAuthenticated && (
                  <Redirect from="/auth" to="/events" exact />
                )}
              </Switch>
            </main>
          </AuthContext.Provider>
        </>
      </Router>
    );
  }
}

export default App;
