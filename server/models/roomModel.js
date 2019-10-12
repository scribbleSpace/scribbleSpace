const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: false,
  },
  saveId: {
    type: Number,
    required: false,
    unique: true,
  },
});

const createRoomModel = name => {
  return mongoose.model(name, RoomSchema);
};

module.exports = createRoomModel;
