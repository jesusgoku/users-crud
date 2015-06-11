'use strict';

var path = require('path');

module.exports = function(sequelize, DataTypes) {
  var UserProfilePhoto = sequelize.define('UserProfilePhoto', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    file: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {}
    },
    instanceMethods: {
      getAbsolutePath: function () {
        return path.join(
          __dirname,
          '/../uploads/',
          this.webPath
        );
      },
      getBasePath: function () {
        return '/user-profile-photos';
      }
    },
    getterMethods: {
      webPath: function () {
        return path.join(
          this.getBasePath(),
          this.getDataValue('file')
        );
      }
    }
  });
  return UserProfilePhoto;
};
