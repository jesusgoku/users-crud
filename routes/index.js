var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/users');
  res.render('index', { title: 'Express' });
});

router.get('/angular', function (req, res) {
  res.render('angular');
});

router.get('/angular/users/:name', function (req, res) {
  res.render('angular/users/' + req.params.name);
});

module.exports = router;
