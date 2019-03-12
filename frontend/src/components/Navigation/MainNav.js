import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import "./MainNav.css";
import AuthContext from "../../context/auth-context";

const MainNav = () => {
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext.isAuthenticated;

  return (
    <header className="main-nav">
      <div className="main-nav__logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="main-nav__item">
        <ul>
          {!isAuthenticated && (
            <li>
              <NavLink to="/auth">Auth</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {isAuthenticated && (
            <li>
              <NavLink to="/bookings">Bookings</NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNav;
