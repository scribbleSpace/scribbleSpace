const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const path = require('path');

const roomCtrl = require('./controllers/roomCtrl');
const userCtrl = require('./controllers/userCtrl');

// DB config
const db =
  'mongodb+srv://scribbleSpace:scribbleSpace@rlcluster-cy0q7.mongodb.net/test?retryWrites=true&w=majority';
// connect to Mongo
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log('MongoDB connected..'))
  .catch(err => console.log(err));

app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../dist'))); //

// app.get('/', ((req, res) => res.sendFile(path.resolve(__dirname + '/dist'))))

// register user account
app.post('/login', userCtrl.createRoom, (req, res) => {
  console.log('user registered');
  res.status(200).send('user registered');
});

app.post('/save', roomCtrl.crRoom); // create Room
// app.get('/find', roomCtrl.findRoom); // find Room not ready

function onConnection(socket) {
  socket.on('drawing', data => socket.broadcast.emit('drawing', data));
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
