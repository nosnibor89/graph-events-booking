import React from "react";
import { NavLink } from "react-router-dom";

import './MainNav.css';

const MainNav = () => (
  <header className="main-nav">
    <div className="main-nav__logo">
      <h1>EasyEvent</h1>
    </div>
    <nav className="main-nav__item">
      <ul>
        <li>
          <NavLink to="/auth">Auth</NavLink>
        </li>
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        <li>
          <NavLink to="/bookings">Bookings</NavLink>
        </li>
      </ul>
    </nav>
  </header>
);

export default MainNav;
