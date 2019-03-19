import React from "react";

import "./EventList.css";
import EventItem from "../EvenItem/EventItem";

const EventList = ({ events, authenticatedUserId, detailHandler }) => {
  const eventItems = events.map(event => (
    <EventItem key={event._id} event={event} userId={authenticatedUserId} onDetail={detailHandler} />
  ));
  return <ul className="event__list">{eventItems}</ul>;
};

export default EventList;
