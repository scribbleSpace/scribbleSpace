const mongoose = require('mongoose');
const createRoomModel = require('../models/roomModel');
const uri = 'mongodb+srv://Admin:heelie@cluster0-vzivm.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })

const User = require('../models/userModel');

const userCtrl = {};

userCtrl.setCookies = function(req, res, next) {
  console.log('Hit Set Cookies');
  const { name, roomName, socketId } = req.body;
  res.cookie('socketId', socketId);
  res.cookie('name', name);
  res.cookie('roomName', roomName);
  next();
};

userCtrl.test = function(req, res, next) {
  const { name, password } = req.body;


  mongoose.connection.db.listCollections().toArray(function (err, names) {
    for (var i=0; i<names.length; i++) {
      console.log(names[i])
    }    
  })
  
};

// find if room exist, if not new room //otherwise check password for the room
userCtrl.checkUser = function(req, res, next) {
  const { name, password } = req.body;
  let Room
  const arr = []; // db collections

  //connect to db, look at all collections, make them an array, 
  //iterate over to find duplicates, if it doesnt exist make new Room model
  mongoose.connection.db.listCollections().toArray((err, data) => {
    for (let i = 0; i < data.length; i++) {
      arr.push(data[i].name);
    }
    
    //no reason for this yet
    res.locals.roomName = roomName;
    // console.log('arr status', arr, roomName);

    if (!arr.includes(roomName)) {
      Room = createRoomModel(roomName);
      // passing input room into argument
      //if roomName doesn't contain an s or a number at the end mongoose will make it so
      Room.create({ roomName, password }, (err, db) => {
        if (err) {
          console.log(err, 'from createRoom')
          return res.status(500).send('error in create room');
        }
        res.locals.name = name;
        res.locals.roomName = roomName;
        // res.status(200).send(res.locals.roomName);
        console.log('new room created');
        return next();
      });
    } else {
      console.log('found in database')
      Room = createRoomModel(roomName);
      // console.log('folder name', Room);
      Room.findOne({ roomName }, (err, rom) => {
        if (err) {
          return res.status(500).send('error in create room');
        }
        if (rom.password !== password) {
          console.log('wrong password', rom);
          return res.status(403)
        }
        return next();
      });
    }
    // console.log('Room exist, password is good'); // async behavior
  });
};

// function to save current state
userCtrl.saveRm = function(req, res, next) {
  const { data } = req.body;
  Room.findOneAndUpdate({}, { data }, { upsert: false }, (err, doc) => {
    if (err) {
      return res.send('error in room');
    }
    console.log('data created', doc);
    return next();
  });
};

userCtrl.loadRm = function(req, res, next) {
  // console.log('req, res', req.body);
  Room.find({}, (err, doc) => {
    if (err) {
      return res.status(500).send('error in create room');
    }
    res.status(200).send(doc[0].data);
    console.log('loading data', doc[0].data);
    return next();
  });
};

module.exports = userCtrl;
