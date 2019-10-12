const mongoose = require('mongoose');
const createRoomModel = require('../models/roomModel');

const User = require('../models/userModel');

const userCtrl = {};

// find if room exist, if not new room //otherwise check password for the room
userCtrl.createRoom = function(req, res, next) {
  const { name, roomName, password } = req.body;

  const arr = []; // db collections
  mongoose.connection.db.listCollections().toArray((err, data) => {
    for (let i = 0; i < data.length; i++) {
      arr.push(data[i].name);
    }
  });
  res.locals.roomName = roomName;

  if (!arr.includes(roomName)) {
    const Room = createRoomModel(roomName);
    // passing input room into argument
    Room.create({ roomName, password }, (err, db) => {
      if (err) {
        return res.status(500).send('error in create room');
      }
      res.locals.name = name;
      console.log('new room created');
      return next();
    });
  } else {
    const Room = createRoomModel(roomName);
    Room.findOne({ roomName }, (err, rom) => {
      if (err) {
        return res.status(500).send('error in create room');
      }
      if (rom.password !== password) {
        return res.status(403).send(false);
      }
      res.cookie({ name }).send(true);
    });
  }
  console.log('Room exist, password is good');
  return next();
};

module.exports = userCtrl;
