var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
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

router.post('/', function (req, res, next) {
  models.User.create(req.body)
    .then(function (user) {
      res.format({
        json: function () {
          res.location('/users/' + user.get('id'));
        },
        html: function () {
          res.redirect('/users');
        }
      });
    }, function (error) {
      res.render('users/create', { user: req.body });
    });
});

router.get('/create', function (req, res, next) {
  res.render('users/create');
});

router.get('/:user_id', function (req, res, next) {
  models.User.findById(req.params.user_id)
    .then(function (user) {
      res.format({
        json: function () {
          res.json(user);
        },
        html: function () {
          res.render('users/view', { user: user });
        }
      });
    });
});

router.get('/:user_id/edit', function (req, res, next) {
  models.User.findById(req.params.user_id)
    .then(function (user) {
      res.render('users/edit', { user: user });
    });
});

router.post('/:user_id/edit', function (req, res, next) {
  models.User.findById(req.params.user_id)
    .then(function (user) {
      user.updateAttributes(req.body)
        .then(function () {
          res.redirect('/users/' + user.id);
        });
    });
});

router.get('/:user_id/delete', function (req, res, next) {
  models.User.findById(req.params.user_id)
    .then(function (user) {
      user.destroy().then(function () {
        res.redirect('/users');
      });
    });
});

router.delete('/:user_id', function(req, res, next) {
  models.User.findById(req.params.user_id)
    .then(function (user) {
      user.destroy().then(function () {
        res.sendStatus(204);
      });
    });
});

module.exports = router;
