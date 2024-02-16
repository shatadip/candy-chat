const express = require('express');
const socket = require('socket.io');

const app = express();
const port = 3008;


const expressServer = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//static files
app.use(express.static('public'));

// socket.io setup

const io = socket(expressServer);

io.on('connection', (socket) => {
    console.log('New user connected', socket.id);
});
// socket.on('chat', (data) => {
//     io.sockets.emit('chat', data);
// });
