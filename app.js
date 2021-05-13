const express = require('express');
const app = express();
const fs = require('fs')
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
app.get('/alawmulaw.js', (req, res) => {
  res.sendFile(__dirname + '/alawmulaw.js')
});

io.on('connection', (socket) => {
  console.log('打开连接');
  let buf = Buffer.alloc(0)
  socket.on('voice', (buffer) => {
    const chunk = new Float32Array(buffer, 0, 4)
    console.log('buffer',  chunk instanceof Float32Array)
    // socket.broadcast.emit('voice',blob)
    const int16Chunk = new Uint8Array(new Int16Array(chunk))
    buf = Buffer.concat([buf, buffer], buf.length + buffer.length)
    io.emit('voice', chunk)
  });
  socket.on('disconnect', () => {
    console.log('断开连接');
    console.log('buf', buf instanceof Float32Array)
    fs.writeFile('teee12.pcm', buf, (err)=>{
      console.log('err', err)
      console.log('文件已被保存')
    })
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
