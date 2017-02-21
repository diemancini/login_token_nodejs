var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var pg          = require('pg');

var config = require('./DAO/config');

var port = process.env.PORT || 3000; 
app.set('secret', config.secret);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('dev'));

console.log("Estou no index.js");
require('./src/routes/routes')(app, express);

app.listen(port);