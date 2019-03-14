import React, { Component } from "react";

import "./Events.css";
import Modal from "../components/Modal/Modal";

class EventsPage extends Component {
  state = {
    creating: false
  };

  startCreateEventHandler = () => {
    this.setState({
      creating: true,
    });
  };

  cancelCreateEventHandler = () => {
    this.setState({
      creating: false,
    });
  };

  createEventHandler = () => {
    this.setState({
      creating: false,
    });
  };

  render() {
    return (
      <>
        <div className="events-control">
          <p>Share your events!</p>
          <button className="btn" onClick={this.startCreateEventHandler}>
            Create Event
          </button>
        </div>
        
        {this.state.creating && (
          <Modal canCancel={true} canConfirm={true} title="Add Event" onCancel={this.cancelCreateEventHandler} onConfirm={this.createEventHandler}>
            Modal Content
          </Modal>
        )}
      </>
    );
  }
}

export default EventsPage;
