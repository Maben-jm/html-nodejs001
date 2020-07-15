var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/toForm', function(req, res, next) {
  res.render('form', { title: 'Express' });
});

router.get('/bootstrp-dialog', function(req, res, next) {
    res.render('alert', { title: 'Express' });
});

module.exports = router;
