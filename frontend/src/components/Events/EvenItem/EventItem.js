import React from "react";

import "./EventItem.css";

const EventItem = ({ event, userId, onDetail }) => (
  <li className="event__item">
    <div>
      <h1>{event.title}</h1>
      <h2>${event.price} - {new Date(event.date).toLocaleDateString()}</h2>
    </div>
    <div>
        {event.createdBy._id !== userId && <button className="btn" onClick={() => onDetail(event._id)}>View</button>}
        {event.createdBy._id === userId && <p>Your Event</p>}
    </div>
  </li>
);

export default EventItem;
