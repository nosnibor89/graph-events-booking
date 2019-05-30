import React, { Component } from "react";
import { gql } from 'apollo-boost';

import "./Events.css";
import Modal from "../components/Modal/Modal";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";
import { Query } from "react-apollo";

const EVENTS_QUERY = gql`
{
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
`;

class EventsPage extends Component {
  state = {
    creating: false,
    selectedEvent: null,
    events: [],
    isLoading: false
  };

  isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.titleElem = React.createRef();
    this.priceElem = React.createRef();
    this.dateElem = React.createRef();
    this.descriptionElem = React.createRef();
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  startCreateEventHandler = () => {
    this.setState({
      creating: true
    });
  };

  cancelCreateEventHandler = () => {
    this.setState({
      creating: false,
      selectedEvent: null
    });
  };

  viewEventHandler = eventId => {
    const event = this.state.events.find(event => event._id === eventId);
    this.setState({
      selectedEvent: event
    });
  };
  bookEventHandler = () => {
    const body = {
      query: `
        mutation BookEvent($eventId: ID!){
          bookEvent(eventId: $eventId){
            _id,
            createdAt,
            updatedAt
          }
        }
        `,
      variables: {
        eventId: this.state.selectedEvent._id
      }
    };

    this.setState({
      isLoading: true
    });

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
        this.setState({
          isLoading: false,
          selectedEvent: null,
          creating: null
        });
      })
      .catch(err => console.log("err", err));
  };

  createEventHandler = () => {
    const event = {
      title: this.titleElem.current.value,
      price: +this.priceElem.current.value,
      date: new Date(this.dateElem.current.value).toString(),
      description: this.descriptionElem.current.value
    };

    const body = {
      query: `
        mutation CreateEvent($title: String!, $price: Float!, $desc: String!, $date: String!){
          createEvent(eventInput: {
            title: $title, 
            price: $price, 
            description: $desc, 
            date: $date}){
            _id,
            title,
            price,
            date,
            description
          }
        }
        `,
      variables: {
        ...event, // Event has almost the same property names as variables.
        desc: event.description
      }
    };

    this.setState({
      isLoading: true
    });

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

        this.setState(prevState => {
          const newEvent = {
            ...data.createEvent,
            createdBy: {
              _id: this.context.userId
            }
          };
          const newEvents = prevState.events.concat(newEvent);
          return { events: newEvents, isLoading: false };
        });
      })
      .catch(err => console.log("err", err));

    this.setState({
      creating: false
    });
  };

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
          confirmText="Confirm"
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

    if (this.state.selectedEvent) {
      modal = (
        <Modal
          canCancel={true}
          canConfirm={this.context.isAuthenticated}
          onCancel={this.cancelCreateEventHandler}
          onConfirm={this.bookEventHandler}
          title={this.state.selectedEvent.title}
          confirmText="Book"
        >
          <h1>{this.state.selectedEvent.title}</h1>
          <h2>
            ${this.state.selectedEvent.price} -{" "}
            {new Date(this.state.selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{this.state.selectedEvent.description}</p>
        </Modal>
      );
    }

    return modal;
  }

  render() {
    return (
      <>
        {this.renderControls()}

        {this.renderModal()}

        <Query query={EVENTS_QUERY}>
          {({ loading, data, error }) => {
            if (loading) return <Spinner />;

            if (error) {
              console.log(error);
              return <p>Error loading events:(</p>;
            }

            return (<EventList
              events={data.events}
              authenticatedUserId={this.context.userId}
              detailHandler={this.viewEventHandler}
            />)

          }}
        </Query>
      </>
    );
  }
}

export default EventsPage;
