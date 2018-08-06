const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');

const userApi = require('./routes/user-api');
const groupApi = require('./routes/group-api');
const stationsApi = require('./routes/stations-api');
const trainsApi = require('./routes/trains-api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use('', userApi);
app.use('', groupApi);
app.use('', stationsApi);
app.use('', trainsApi);

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(__dirname + '../public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: true, limit: '5mb'
}));
app.use(bodyParser.json({limit: '5mb'}));

app.get('/', function(req, res){
    res.render('login/login.html');
});

module.exports = app;
