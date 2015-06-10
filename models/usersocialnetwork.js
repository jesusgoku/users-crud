'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserSocialNetwork = sequelize.define('UserSocialNetwork', {
    socialUsername: {
      type: DataTypes.STRING
    },
    socialId: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        UserSocialNetwork.belongsTo(models.SocialNetwork);
      }
    }
  });
  return UserSocialNetwork;
};
