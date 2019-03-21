import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: []
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  render() {
    return (
      <>
        <h1>The Bookings Page</h1>
        <ul>{this.state.isLoading ? <Spinner/> : this.renderBookings()}</ul>
      </>
    );
  }

  renderBookings() {
    return this.state.bookings.map(booking => <li key={booking._id}>{booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}</li>);
  }

  fetchBookings() {
    const body = {
      query: ` query {
            bookings{
              _id,
              createdAt,
              updatedAt,
              event {
                title
              }
            }
          }
            `
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
        if (data.bookings) {
          this.setState({
            bookings: data.bookings,
            isLoading: false
          });
        }
      })
      .catch(err => console.log("err", err));
  }
}

export default BookingsPage;
