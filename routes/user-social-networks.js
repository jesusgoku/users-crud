var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/:user_id/social-networks', function (req, res) {
  models.UserSocialNetwork.findAll()
    .then(function (socialNetworks) {
      res.json(socialNetworks);
    });
});

router.post('/:user_id/social-networks', function (req, res) {
  models.User.findById(req.params.user_id)
    .then(function (user) {
      models.UserSocialNetwork.create(req.body)
        .then(function (socialNetwork) {
          user.addUserSocialNetwork(socialNetwork)
            .then(function (socialNetwork) {
              res.json(socialNetwork);
            }, function (error) {
              res.status(400).json({ errors: error });
            });
      });
    }, function (error) {
      res.send(400).json({ errors: error.errors });
    });
  }
);

router.delete('/:user_id/social-networks/:network_id', function (req, res) {
  models.UserSocialNetwork.findById(req.params.network_id)
    .then(function (socialNetwork) {
      models.User.findById(req.params.user_id)
        .then(function (user) {
          user.removeUserSocialNetwork(socialNetwork)
            .then(function() {
              res.sendStatus(200);
            });
        });
    });
});

module.exports = router;
