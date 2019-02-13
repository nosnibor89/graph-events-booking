const bcrypt = require("bcrypt");

const Event = require("../models/event");
const User = require("../models/user");
const Booking = require("../models/booking");

const userId = "5c62b562aca00d2d80b55f20";

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

  return events.map(async event => {
    return {
      ...event._doc,
      date: new Date(event._doc.date).toISOString(),
      createdBy: findUser.bind(this, event.createdBy)
    };
  });
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

const resolver = {
  async users() {
    const users = await User.find().select(["_id", "email", "createdEvents"]);

    return users.map(async user => {
      const currentUser = await findUser(user._id);
      return {
        ...currentUser
      };
    });
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

    return events.map(async event => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        createdBy: findUser.bind(this, event.createdBy)
      };
    });
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

    return {
      ...event._doc,
      date: new Date(event._doc.date).toISOString(),
      createdBy: findUser.bind(this, creator._id)
    };
  },

  async bookings() {
    const bookings = await Booking.find();

    return bookings.map(booking => {
      return {
        ...booking._doc,
        user: findUser.bind(this, booking._doc.user),
        event: findEvent.bind(this, booking._doc.event),
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString()
      };
    });
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

    return {
      ...booking._doc,
      user: findUser.bind(this, booking._doc.user),
      event: findEvent.bind(this, booking._doc.event),
      createdAt: new Date(booking._doc.createdAt).toISOString(),
      updatedAt: new Date(booking._doc.updatedAt).toISOString()
    };
  },

  async cancelBooking({ bookingId }) {
    const booking = await Booking.findByIdAndDelete(bookingId).populate(
      "event"
    );

    if (!booking) {
      throw new Error("No booking found!");
    }

    return {
      ...booking.event._doc,
      date: new Date(booking.event._doc.date).toISOString(),
      createdBy: findUser.bind(this, booking._doc.event._doc.createdBy)
    };
  }
};

module.exports = resolver;
