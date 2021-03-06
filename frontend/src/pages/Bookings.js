import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Bookings/BookingList/BookingList";
import BookingsChart from "../components/Bookings/BookingsChart/BookingsChart";
import BookingsControls from "../components/Bookings/BookingsControls/BookingsControls";

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
    tab: "list"
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  render() {
    const content = this.state.isLoading ? <Spinner /> : this.renderBookings();

    return (
      <>
        <h1>The Bookings Page</h1>
        <ul>{content}</ul>
      </>
    );
  }

  renderBookings() {
    const content =
      this.state.tab !== "chart" ? (
        <BookingList
          bookings={this.state.bookings}
          onDelete={this.cancelBookingHandler}
        />
      ) : (
        <BookingsChart bookings={this.state.bookings} />
      );

    return (
      <>
        <BookingsControls
          showList={() => this.changeTabHandler("list")}
          showTabs={() => this.changeTabHandler("chart")}
          activeType={this.state.tab}
        />

        <div>{content}</div>
      </>
    );
  }

  changeTabHandler = tabType => {
    this.setState({
      tab: tabType
    });
  };

  cancelBookingHandler = bookingId => {
    const body = {
      query: ` 
      mutation CancelBooking($id: ID!){
        cancelBooking(bookingId: $id) {
          _id,
          title
        }
      }
      `,
      variables: {
        id: bookingId
      }
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

        this.setState(prevState => {
          const bookings = prevState.bookings.filter(
            booking => booking._id !== bookingId
          );

          return {
            bookings
          };
        });
      })
      .catch(err => console.log("err", err));
  };

  fetchBookings() {
    const body = {
      query: ` query {
            bookings{
              _id,
              createdAt,
              updatedAt,
              event {
                title,
                price
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
