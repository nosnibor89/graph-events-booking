const { buildSchema } = require("graphql");

const schema = `

type Event {
    id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
}

input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
}

type RootQuery {
    events: [Event!]!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`;

module.exports = buildSchema(schema);
