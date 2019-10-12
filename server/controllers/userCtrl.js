const User = require('../models/userModel.js');

const userCtrl = {};
userCtrl.setCookies = function(req, res, next){
  console.log('Hit Set Cookies');
  const { name, roomName, clientSocketId } = req.body;
  res.cookie('clientSocketId', clientSocketId);
  res.cookie('name', name);
  res.cookie('roomName', roomName);
  next();
}
// find if room exist, if not new room //otherwise check password for the room
userCtrl.createRoom = function(req, res, next) {
  const { name, roomName, password } = req.body;
  User.find({ roomName }, function(err, room) {
    if (!room) {
      User.create({ roomName, password }, (err, db) => {
        if (err) {
          return res.status(500).send('error in create room');
        }
        res.locals.name = name;
        console.log('new room created');
        return next();
      });
    } else {
      console.log('Room exist, check password');
      if (room.password !== password) {
        return res.status(403).send(false);
      }
      return next();
    }
  });
};

userCtrl.verifyUser = function(req, res, next) {
  const { name, room, password } = req.body;
  let errors = [];
  if (!name || !room || !password) {
    errors.push({ msg: 'Please fill in all fields' });
  }
  if (errors.length > 0) {
    res.render('register', { errors, name, email, password, password2 });
  } else {
    User.findOne({ room: room }, function(err, user) {
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
};

module.exports = userCtrl;
