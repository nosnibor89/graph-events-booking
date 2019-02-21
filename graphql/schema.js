const { buildSchema } = require("graphql");

const schema = `

# User:
# password should not be retrieved in query
type User {
    _id: ID!
    email: String!
    createdEvents: [Event!]!
}

input UserInput {
    email: String!
    password: String!
}

type Auth {
    userId: ID!,
    token: String!
    tokenExpiration: Int!
}

type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    createdBy: User
}

input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
}

type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type RootQuery {
    users: [User!]!
    events: [Event!]!
    
    bookings: [Booking!]!

    login(email: String!, password: String!): Auth!
}

type RootMutation {
    createUser(userInput: UserInput): User
    createEvent(eventInput: EventInput): Event

    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`;

module.exports = buildSchema(schema);
