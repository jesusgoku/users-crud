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
      associate: function(models) {
        // UserProfilePhoto.hasOne(models.User);
      }
    },
    getterMethods: {
      absolutePath: function () {
        return path.join(
          __dirname,
          '/../public/',
          this.webPath
        );
      },
      webPath: function () {
        return path.join(
          this.basePath,
          this.getDataValue('file')
        );
      },
      basePath: function () {
        return '/user-profile-photos';
      }
    }
  });
  return UserProfilePhoto;
};
