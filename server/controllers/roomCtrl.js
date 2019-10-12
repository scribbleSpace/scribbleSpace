const createRoomModel = require('../models/roomModel');

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

module.exports = roomCtrl;
