'use strict';
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      notEmpty: true
    },
    lastName: {
      type: DataTypes.STRING,
      notEmpty: true
    },
    email: {
      type: DataTypes.STRING,
      isEmail: true
    },
    birthDay: {
      type: DataTypes.DATE,
      isDate: true,
      get: function () {
        var birthDate = this.getDataValue('birthDay');
        return birthDate.getFullYear() + '-' + (birthDate.getMonth() + 1) + '-' + birthDate.getDate();
      }
    },
    password: {
      type: DataTypes.STRING,
      notEmpty: true,
      len: [8, 24],
      set: function (data) {
        var _this = this;
        _this.setDataValue('password', data);
        bcrypt.hash(data, 8, function (err, hash) {
          _this.setDataValue('password', hash);
        });
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.UserProfilePhoto);
        User.hasOne(models.UserProfilePhoto, { as: 'CurrentProfilePhoto', foreignKey: 'current_user_id' });
        User.hasMany(models.UserSocialNetwork);
      }
    },
    getterMethods: {
      fullName: function () {
        return this.firstName + ' ' + this.lastName;
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ]
  });
  return User;
};
