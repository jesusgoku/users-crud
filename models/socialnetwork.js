'use strict';
module.exports = function(sequelize, DataTypes) {
  var SocialNetwork = sequelize.define('SocialNetwork', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return SocialNetwork;
};