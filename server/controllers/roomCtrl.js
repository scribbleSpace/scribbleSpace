const createRoomModel = require('../models/roomModel.js');

// passing input room into argument
const Room = createRoomModel('room6');
const roomCtrl = {};

roomCtrl.crRoom = function(req, res, next) {
  Room.count({}, (err, count) => {
    if (err) {
      return res.send('error in count');
    }
    const { data } = req.body;
    Room.create({ data, saveId: count + 1 }, (err, doc) => {
      if (err) {
        return res.send('error in room');
      }
      console.log('Room created');
      return next();
    });
  });
};

roomCtrl.findRoom = function(req, res, next) {
  const { saveId } = req.body;
  Room.find({ saveId }, (err, doc) => {
    if (err) {
      return res.send('error in room');
    }
    console.log('Found Rooms', doc);
    res.json(doc);
    return next();
  });
};

roomCtrl.joinRoom = function(req, res, next) {
  
}

// roomCtrl.verifyUser = function(req, res, next) {
//   const { name, email, password, password2 } = req.body;
//   let errors = [];
//   if (errors.length > 0) {
//     res.render('register', { errors, name, email, password, password2 });
//   } else {
//     User.findOne({ email: email }, function(err, user) {
//       if (user) {
//         // user exist
//         console.log('email exist!!!!!');
//         errors.push({ msg: 'Email is already registered' });
//         res.render('register', { errors, name, email, password, password2 });
//       } else {
//         console.log('user verified');
//         return next();
//       }
//     });
//   }
// };

module.exports = roomCtrl;
