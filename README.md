mutation {
  createEvent(eventInput: { 
    title: "Some4", 
    description: "some des4", 
    price:12.3,
    date: "02/08/2019"
  }) {
    _id,
    title
    date
  }
}

# query {
#   events{
#     _id,
#     title,
#     date
#   }
# }

mutation {
  createUser(userInput: { 
    email: "myuseremaill", 
    password: "123", 
  }) {
    _id,
    email,
  }
}

 #query {
 #  users{
 #    _id,
 #    email,
 #  }
 #}

  query {
   users{
     _id,
     email,
    events{
      _id,
      title,
      price
    }
   }
 }

 mutation {
  bookEvent(eventId: "5c62b58e7b59fc2d8f826c11"){
    _id,
    createdAt,
    updatedAt,
    user{
      email
    },
    event{
      title,
      date,
      price
    }
  }
}

query {
  bookings{
    _id,
    createdAt,
    updatedAt,
    user{
      email
    },
    event{
      title,
      createdBy{
        email
      }
    }
  }
}

mutation {
  cancelBooking(bookingId: "5c643ba3bbbdc80eb7f245e4") {
    _id,
    title
  }
}