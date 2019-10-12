const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

const roomCtrl = require('./controllers/roomCtrl');

// DB config
const db =
  'mongodb+srv://scribbleSpace:scribbleSpace@rlcluster-cy0q7.mongodb.net/test?retryWrites=true&w=majority';
// connect to Mongo
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB connected..');
  })
  .catch(err => {
    console.log(err);
  });

app.use(express.json());

app.use(express.static(__dirname + '../dist'));

app.post('/save', roomCtrl.crRoom); // create Room

app.get('/find', roomCtrl.findRoom); // find Room

function onConnection(socket) {
  socket.on('drawing', data => socket.broadcast.emit('drawing', data));
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
