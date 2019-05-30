import React from "react";
import './BookingControls.css';

const BookingsControls = props => (
  <div className="bookings-controls"> 
    <button className={props.activeType === 'list' ? 'active' : null} onClick={props.showList}>
      List
    </button>
    <button className={props.activeType === 'chart' ? 'active' : null} onClick={props.showTabs}>
      Chart
    </button>
  </div>
);

export default BookingsControls;
