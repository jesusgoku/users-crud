var express = require('express');
var negotiate = require('express-negotiate');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/users');
  res.render('index', { title: 'Express' });
});

module.exports = router;
