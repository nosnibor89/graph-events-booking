const mockedEvents = [];

const resolver = {
  events: () => {
    return mockedEvents;
  },
  createEvent: ({ eventInput }) => {
    const { title, description, price, date } = eventInput;
    const event = {
      id: Math.random().toString(),
      title,
      description,
      price,
      date
    };
    mockedEvents.push(event);

    return event;
  }
};

module.exports = resolver;
