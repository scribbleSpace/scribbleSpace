const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const path = require('path');
const cookieParser = require('cookie-parser');

// const roomCtrl = require('./controllers/roomCtrl');
const userCtrl = require('./controllers/userCtrl');

app.use(express.json());
app.use(cookieParser());


//serve the bundle
app.use(express.static(path.resolve(__dirname, '../dist')), (req, res, next)=>{
  next()
}); //

app.get('/dist/bundle.js', (req,res,next)=>{
  res.sendFile(path.resolve(__dirname, '../dist/bundle.js'))
})

app.get('/', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '../src/index.html'))
})

app.post('/login', userCtrl.test, (req,res,next)=>{
  console.log('login on express', req.body)
})


function onConnection(socket) {
  socket.on('transfer', data => io.emit('broadcast', data));
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
