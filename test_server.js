var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.use(bodyParser());

app.post('/test/post', function (req, res) {
	res.send(req.body.list);
});

app.get('/test/get', function (req, res) {
	res.send(req.query.list);
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(8000);
