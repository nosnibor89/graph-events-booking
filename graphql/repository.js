
const DataLoader = require('dataloader');

const Event = require("../models/event");
const User = require("../models/user");

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
  