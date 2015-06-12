var models = require('../models');
var express = require('express');
var router = express.Router();

/**
 * List
 */
router.get('/', function(req, res) {
  models.User.findAll()
    .then(function (users) {
      res.format({
        json: function() {
          res.json(users);
        },
        html: function () {
          res.render('users/index', { users: users });
        }
      });
    });
});

/**
 * Create a new user
 */
router.post('/', function (req, res) {
  models.User.create(req.body)
    .then(function (user) {
      res.format({
        json: function () {
          res.sendStatus(204);
        },
        html: function () {
          res.redirect('/users');
        }
      });
    }, function (error) {
      res.format({
        json: function () {
          res.status(400).json({
            errors: error.errors
          });
        },
        html: function () {
          res.render('users/create', { user: req.body, errors: error.errors });
        }
      });
    });
});

/**
 * Display form to create a new
 */
router.get('/create', function (req, res) {
  res.render('users/create');
});

/**
 * View user details
 */
router.get('/:user_id', function (req, res) {
  models.User.findOne({
      where: { id: req.params.user_id },
      include: { all: true, nested: true }
    })
    .then(function (user) {
      res.format({
        json: function () {
          res.json(user);
        },
        html: function () {
            models.SocialNetwork.findAll().then(function (socialNetworks) {
                res.render('users/view', { user: user, socialNetworks: socialNetworks });
            });
        }
      });
    });
});

/**
 * Update user resource
 */
router.put('/:user_id', function (req, res) {
  models.User.findById(req.params.user_id)
    .then(function(user) {
      if (typeof req.body.CurrentProfilePhotoId !== 'undefined') {
        models.UserProfilePhoto.findById(req.body.CurrentProfilePhotoId)
          .then(function (profilePhoto) {
            user.setCurrentProfilePhoto(profilePhoto);
          });
      }
      user.updateAttributes(req.body)
        .then(function (user) {
          res.json(user);
        }, function (error) {
          res.status(400).json({ errors: error.errors });
        });
    }, function (error) {
      res.sendStatus(404);
    });
});

/**
 * Display form to edit user
 */
router.get('/:user_id/edit', function (req, res) {
  models.User.findById(req.params.user_id)
    .then(function (user) {
      res.render('users/edit', { user: user });
    });
});

/**
 * Update user
 */
router.post('/:user_id/edit', function (req, res) {
  models.User.findById(req.params.user_id)
    .then(function (user) {
      user.updateAttributes(req.body)
        .then(function () {
          res.redirect('/users/' + user.id);
        });
    });
});

/**
 * Delete user
 */
router.get('/:user_id/delete', function (req, res) {
  models.User.findById(req.params.user_id)
    .then(function (user) {
      user.destroy().then(function () {
        res.redirect('/users');
      });
    });
});

/**
 * Delete user resource
 */
router.delete('/:user_id', function(req, res) {
  models.User.findById(req.params.user_id)
    .then(function (user) {
      user.destroy().then(function () {
        res.sendStatus(204);
      });
    });
});

module.exports = router;
