const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

app.get('/test.mp3', (req, res) => {
  res.sendFile(__dirname + '/test.mp3')
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('voice', (blob) => {
    console.log('blob', blob)
    // socket.broadcast.emit('voice',blob)
    io.emit('voice', blob)
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
