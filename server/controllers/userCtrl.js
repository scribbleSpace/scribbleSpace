const mongoose = require('mongoose');
const createRoomModel = require('../models/roomModel');

const User = require('../models/userModel');

const userCtrl = {};

let Room;
// find if room exist, if not new room //otherwise check password for the room
userCtrl.createRoom = function(req, res, next) {
  const { name, roomName, password } = req.body;

  mongoose.connection.db.listCollections().toArray((err, data) => {
    const arr = []; // db collections
    for (let i = 0; i < data.length; i++) {
      arr.push(data[i].name);
    }
    res.locals.roomName = roomName;
    // console.log('arr status', arr, roomName);

    if (!arr.includes(roomName)) {
      Room = createRoomModel(roomName);
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
      Room = createRoomModel(roomName);
      // console.log('folder name', Room);
      Room.findOne({ roomName }, (err, rom) => {
        if (err) {
          return res.status(500).send('error in create room');
        }
        if (rom.password !== password) {
          console.log('wrong password', rom);
          return res.status(403).send('false');
        }
        res.cookie({ name }).send('true');
        return next();
      });
    }
    // console.log('Room exist, password is good'); // async behavior
  });
};

// function to save current state
userCtrl.saveRm = function(req, res, next) {
  const { data } = req.body;
  Room.findOneAndUpdate({}, { data }, { upsert: true }, (err, doc) => {
    if (err) {
      return res.send('error in room');
    }
    console.log('data created', doc);
    return next();
  });
};

module.exports = userCtrl;
