const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');

const Event = require("../models/event");
const User = require("../models/user");
const Booking = require("../models/booking");
const { dateToString } = require("../helpers/date");

// #region Resolver helpers
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
  return transformCollection(users);
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

const findUsers = async ids => {
  const users = await User.find({ _id: { $in: ids } }).select(["_id", "email", "createdEvents"]);
  return transformUsers(users);
}

/**
 * @param string id
 */
const findUser = async id => {
  const user = await userLoader.load(String(id));
  
  return {
    ...user,
    createdEvents: eventLoader.loadMany.bind(this, user.createdEvents)
  };
};

/**
 * @param array ids
 */
const findEvents = async ids => {
  let events = await Event.find({ _id: { $in: ids } });
  return transformEvents(events);
};

/**
 * @param string id
 */
const findEvent = async id => {
  const event = await eventLoader.load(String(id));
  return {
    ...event,
    date: new Date(event.date).toISOString(),
    createdBy: findUser.bind(this, event.createdBy)
  };
};

const eventLoader = new DataLoader(eventIds => findEvents(eventIds));

const userLoader = new DataLoader(userIds => findUsers(userIds));

// #endregion

//#region Resolvers
/**
 * App Resolvers
 */
const resolver = {
  async login({ email, password }) {
    const user = await User.findOne({ email });

    if(!user) {
      throw Error('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user._doc.password);

    if (!match) {
      throw Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id, email: user.email}, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return {
      token,
      userId: user.id,
      tokenExpiration: 1,
    };

  },

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

  async createEvent({ eventInput }, { isAuthenticated, userId }) {

    if(!isAuthenticated) {
      throw new Error("Access denied: Not autheticated");
    }

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

  async bookings(_, { isAuthenticated, userId }) {
    if(!isAuthenticated) {
      throw new Error("Access denied: Not autheticated");
    }

    const bookings = await Booking.find({user: userId});
    return transformBookings(bookings);
  },

  async bookEvent({ eventId }, { isAuthenticated, userId}) {
    if(!isAuthenticated) {
      throw new Error("Access denied: Not autheticated");
    }

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

  async cancelBooking({ bookingId }, { isAuthenticated }) {

    if(!isAuthenticated) {
      throw new Error("Access denied: Not autheticated");
    }

    const booking = await Booking.findByIdAndDelete(bookingId).populate(
      "event"
    );

    if (!booking) {
      throw new Error("No booking found!");
    }

    return transformEvent(booking.event._doc);
  }
};

//#endregion Resolvers

module.exports = resolver;
