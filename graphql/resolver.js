const Event = require("../models/event");

const mockedEvents = [];

const resolver = {
  events: async() => {
    return await Event.find();
  },
  createEvent: async ({ eventInput }) => {
    const { title, description, price, date } = eventInput;

    const event = await Event.create({
      title,
      description,
      price,
      date: new Date(date),
    });

    console.log(event);
    console.log(event._doc);
    return event;
  }
};

module.exports = resolver;
