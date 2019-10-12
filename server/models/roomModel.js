const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true,
  },
  saveId: {
    type: Number,
    required: true,
    unique: true,
  },
});

const createRoomModel = name => {
  return mongoose.model(name, RoomSchema);
};

module.exports = createRoomModel;
