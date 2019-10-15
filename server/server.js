const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

const roomCtrl = require('./controllers/roomCtrl');
const userCtrl = require('./controllers/userCtrl');

// DB config
const uri =
  'mongodb+srv://Admin:heelie@cluster0-vzivm.mongodb.net/test?retryWrites=true&w=majority'
mongoose
  .connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log('MongoDB connected..'))
  .catch(err => console.log(err));

app.use(express.json());
app.use(cookieParser());

//serve the bundle
app.use(express.static(path.resolve(__dirname, '../dist'))); //

// app.get('/', ((req, res) => res.sendFile(path.resolve(__dirname + '/dist'))))

// login user account
app.post('/login', userCtrl.setCookies, userCtrl.createRoom);

app.post('/save', userCtrl.saveRm); // onClick save to save state

app.post('/load', userCtrl.loadRm);

function onConnection(socket) {
  socket.on('transfer', data => io.emit('broadcast', data));
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
