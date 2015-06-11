var models = require('../models');
var express = require('express');
var router = express.Router();

/**
 * Get user social network resources
 */
router.get('/:user_id/social-networks', function (req, res) {
  models.UserSocialNetwork.findAll()
    .then(function (socialNetworks) {
      res.json(socialNetworks);
    }, createSendError(res));
});

/**
 * Get user social network resource
 */
router.get('/:user_id/social-networks/:network_id', function (req, res) {
  models.UserSocialNetwork.findById(req.params.network_id)
    .then(function (userSocialNetwork) {
      res.json(userSocialNetwork);
    })
  ;
});

/**
 * Create user social network resource
 */
router.post('/:user_id/social-networks', function (req, res) {
  var shared = {user: null};
  models.User.findById(req.params.user_id)
    .then(function (user) {
      shared.user = user;
      return models.UserSocialNetwork.create(req.body);
    }, createSendError(res))
    .then(function (userSocialNetwork) {
      return shared.user.addUserSocialNetwork(userSocialNetwork);
    }, createSendError(res))
    .then(function (userSocialNetwork) {
      res.json(userSocialNetwork);
    }, createSendError(res))
  ;
});

/**
 * Delete user social network resource
 */
router.delete('/:user_id/social-networks/:network_id', function (req, res) {
  var shared = { userSocialNetwork: null };
  models.UserSocialNetwork.findById(req.params.network_id)
    .then(function (userSocialNetwork) {
      if (!userSocialNetwork) { res.sendStatus(404); }
      shared.userSocialNetwork = userSocialNetwork;
      return models.User.findById(req.params.user_id);
    }, createSendError(res))
    .then(function (user) {
      if (!user) { res.sendStatus(404); }
      return user.removeUserSocialNetwork(shared.userSocialNetwork);
    }, createSendError(res))
    .then(function () {
      res.sendStatus(204);
    }, createSendError(res))
  ;
});

//- Utils
function createSendError (res) {
  return function (error) {
    res.status(400).json({ errors: error.errors });
  }
}

module.exports = router;
