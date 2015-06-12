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
    }, createSendError(res));
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
          res.render('users/create', {
            user: req.body,
            errors: error.errors
          });
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
  var shared = { user: null };
  models.User.findOne({
      where: { id: req.params.user_id },
      include: { all: true, nested: true }
    })
    .then(function (user) {
      shared.user = user;
      console.log(req.accepts('json'));
      if (req.accepts('html') === 'html') {
        return models.SocialNetwork.findAll();
      } else {
        res.json(user);
      }
    }, createSendError(res))
    .then(function (socialNetworks) {
      res.render('users/view', {
        user: shared.user,
        socialNetworks: socialNetworks
      });
    }, createSendError(res))
  ;
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

      return user.updateAttributes(req.body);
    }, createSendError(res))
    .then(function (user) {
      res.json(user);
    }, createSendError(res))
  ;
});

/**
 * Display form to edit user
 */
router.get('/:user_id/edit', function (req, res) {
  models.User.findById(req.params.user_id)
    .then(function (user) {
      res.render('users/edit', { user: user });
    }, createSendError(res));
});

/**
 * Update user
 */
router.post('/:user_id/edit', function (req, res) {
  models.User.findById(req.params.user_id)
    .then(function (user) {
      return user.updateAttributes(req.body);
    }, createSendError(res))
    .then(function (user) {
      res.redirect('/users/' + user.id);
    }, createSendError(res))
  ;
});

/**
 * Delete user
 */
router.get('/:user_id/delete', function (req, res) {
  models.User.findById(req.params.user_id)
    .then(function (user) {
      return user.destroy();
    }, createSendError(res))
    .then(function() {
      res.redirect('/users');
    }, createSendError(res))
  ;
});

/**
 * Delete user resource
 */
router.delete('/:user_id', function(req, res) {
  models.User.findById(req.params.user_id)
    .then(function (user) {
      return user.destroy();
    }, createSendError(res))
    .then(function () {
      res.sendStatus(204);
    }, createSendError(res))
  ;
});

//- Util
function createSendError(res) {
  return function (error) {
    res.status(400).json({ errors: error.errors });
  };
}

module.exports = router;
