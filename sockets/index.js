var ee = require('../events');

module.exports = function (io) {
  io.on('connection', function (socket) {
    console.log('Socket Connection');

    socket.emit('serverRestart');

    require('./user').init(socket);
  });
}
