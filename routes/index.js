var express = require('express');
var router = express.Router(),
    path = require('path'),
    async = require('async');

router.get('/', function(req, res, next) {
    res.sendFile('index.html', { root: './views' })
});

module.exports = router;
