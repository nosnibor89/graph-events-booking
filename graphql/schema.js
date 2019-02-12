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

type RootQuery {
    users: [User!]!
    events: [Event!]!
}

type RootMutation {
    createUser(userInput: UserInput): User
    createEvent(eventInput: EventInput): Event
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`;

module.exports = buildSchema(schema);
