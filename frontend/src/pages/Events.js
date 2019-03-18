import React, { Component } from "react";

import "./Events.css";
import Modal from "../components/Modal/Modal";
import AuthContext from "../context/auth-context";

class EventsPage extends Component {
  state = {
    creating: false,
    events: []
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.titleElem = React.createRef();
    this.priceElem = React.createRef();
    this.dateElem = React.createRef();
    this.descriptionElem = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({
      creating: true
    });
  };

  cancelCreateEventHandler = () => {
    this.setState({
      creating: false
    });
  };

  createEventHandler = () => {
    const event = {
      title: this.titleElem.current.value,
      price: +this.priceElem.current.value,
      date: new Date(this.dateElem.current.value).toString(),
      description: this.descriptionElem.current.value
    };

    console.log(event.date)
    const body = {
      query: `
        mutation{
          createEvent(eventInput: {
            title: "${event.title}", 
            price:${event.price}, 
            description: "${event.description}", 
            date:"${event.date}"}){
            _id,
            title,
            description
          }
        }
        `
    };

    fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.context.token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }

        return res.json();
      })
      .then(({ data }) => {
        console.log(data);
        this.fetchEvents();
      })
      .catch(err => console.log("err", err));

    this.setState({
      creating: false
    });
  };

  fetchEvents() {
    const body = {
      query: `
        query{
          events{
            _id,
            title, 
            price, 
            description, 
            date,
            createdBy {
              _id,
              email
            }
          }
        }
        `
    };

    fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }

        return res.json();
      })
      .then(({ data }) => {
        if (data.events) {
          this.setState({
            events: data.events
          });
        }
      })
      .catch(err => console.log("err", err));
  }

  renderControls() {
    let controls = null;
    if (this.context.isAuthenticated) {
      controls = (
        <div className="events-control">
          <p>Share your events!</p>
          <button className="btn" onClick={this.startCreateEventHandler}>
            Create Event
          </button>
        </div>
      );
    }
    return controls;
  }

  renderModal() {
    let modal = null;

    if (this.state.creating) {
      modal = (
        <Modal
          canCancel={true}
          canConfirm={true}
          title="Add Event"
          onCancel={this.cancelCreateEventHandler}
          onConfirm={this.createEventHandler}
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={this.titleElem} />
            </div>

            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={this.priceElem} />
            </div>

            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={this.dateElem} />
            </div>

            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" ref={this.descriptionElem} />
            </div>
          </form>
        </Modal>
      );
    }
    return modal;
  }

  renderEvents() {
    const events = this.state.events.map(event => (
      <li key={event._id} className="events__list__item">
        {event.title}
      </li>
    ));
    return <ul className="events__list">{events}</ul>;
  }

  render() {
    return (
      <>
        {this.renderControls()}

        {this.renderModal()}

        {this.renderEvents()}
      </>
    );
  }
}

export default EventsPage;
