const bcrypt = require("bcrypt");

const Event = require("../models/event");
const User = require("../models/user");
const Booking = require("../models/booking");
const { dateToString } = require("../helpers/date");

const userId = "5c62b562aca00d2d80b55f20";

const transformCollection = collection =>
  collection.map(item => Object.assign({}, item._doc));

const transformEvent = event => {
  return {
    ...event,
    date: dateToString(event.date),
    createdBy: findUser.bind(this, event.createdBy)
  };
};

const transformEvents = events => {
  const transformedEvents = transformCollection(events);
  return transformedEvents.map(event => transformEvent(event));
};

const transformUser = user => {
  return findUser(user._id);
};

const transformUsers = users => {
  const transformedUsers = transformCollection(users);
  return transformedUsers.map(user => transformUser(user));
};

const transformBooking = booking => {
  return {
    ...booking,
    user: findUser.bind(this, booking.user),
    event: findEvent.bind(this, booking.event),
    createdAt: dateToString(booking.createdAt),
    updatedAt: dateToString(booking.updatedAt)
  };
};

const transformBookings = bookings => {
  const transformedBookings = transformCollection(bookings);
  return transformedBookings.map(booking => transformBooking(booking));
};

/**
 * @param string id
 */
const findUser = async id => {
  const user = await User.findById(id).select([
    "_id",
    "email",
    "createdEvents"
  ]);

  return {
    ...user._doc,
    createdEvents: findEvents.bind(this, user._doc.createdEvents)
  };
};

/**
 * @param array ids
 */
const findEvents = async ids => {
  const events = await Event.find({ _id: { $in: ids } });
  return transformEvents(events);
};

/**
 * @param string id
 */
const findEvent = async id => {
  const event = await Event.findById(id);
  return {
    ...event._doc,
    date: new Date(event._doc.date).toISOString(),
    createdBy: findUser.bind(this, event._doc.createdBy)
  };
};

/**
 * App Resolvers
 */
const resolver = {
  async users() {
    const users = await User.find().select(["_id", "email", "createdEvents"]);
    return transformUsers(users);
  },

  async createUser({ userInput }) {
    const { email, password } = userInput;
    const currentUser = await User.findOne({ email }).select(["_id"]);

    if (currentUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(
      password,
      +process.env.SALT_ROUNDS
    );
    const user = await User.create({
      email,
      password: hashedPassword
    });
    return await findUser(user.id);
  },

  async events() {
    const events = await Event.find();
    return transformEvents(events);
  },

  async createEvent({ eventInput }) {
    const { title, description, price, date } = eventInput;
    const creator = await User.findById(userId).populate("createdEvents");

    if (!creator) {
      throw new Error("User for this event not found!");
    }

    const event = await Event.create({
      title,
      description,
      price,
      date: new Date(date),
      createdBy: creator._id
    });

    creator.createdEvents.push(event);
    await creator.save();

    return transformEvent(event._doc);
  },

  async bookings() {
    const bookings = await Booking.find();
    return transformBookings(bookings);
  },

  async bookEvent({ eventId }) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new Error("Event not found!");
    }

    const booking = await Booking.create({
      user: userId,
      event: event.id
    });

    return transformBooking(booking._doc);
  },

  async cancelBooking({ bookingId }) {
    const booking = await Booking.findByIdAndDelete(bookingId).populate(
      "event"
    );

    if (!booking) {
      throw new Error("No booking found!");
    }

    return transformEvent(booking.event._doc);
  }
};

module.exports = resolver;
