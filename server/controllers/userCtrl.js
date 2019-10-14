<<<<<<< HEAD
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
=======
const User = require('../models/User');

const userCtrl = {};

userCtrl.createUser = function(req, res, next) {
  const { name, email, password } = req.body;
  User.create({ name, email, password }, (err, db) => {
    if (err) {
      return res.render('../views/register', { error: err });
    }
    res.locals.acc = db; // res.locals.id = db._id;
    console.log('account created');
    return next();
  });
};

userCtrl.verifyUser = function(req, res, next) {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }
  if (errors.length > 0) {
    res.render('register', { errors, name, email, password, password2 });
  } else {
    User.findOne({ email: email }, function(err, user) {
      if (user) {
        // user exist
        console.log('email exist!!!!!');
        errors.push({ msg: 'Email is already registered' });
        res.render('register', { errors, name, email, password, password2 });
      } else {
        console.log('user verified');
        return next();
      }
    });
  }
>>>>>>> 81074db9446e002b9ae37673a08e9c6e4a140c74
};

module.exports = userCtrl;
