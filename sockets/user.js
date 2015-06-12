var ee = require('../events');

var exports = module.exports = {};

exports.init = function (io) {
  ee.on('userCreate', function (user) {
    io.emit('userCreate', user);
  });

  ee.on('userUpdate', function (user) {
    io.emit('userUpdate', user);
  });

  ee.on('userDestroy', function (user) {
    io.emit('userDestroy', user);
  });
};
