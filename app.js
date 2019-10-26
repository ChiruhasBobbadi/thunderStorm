const createError = require('http-errors');
const net = require('net');
const client = new net.Socket();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoDBStore = require('connect-mongodb-session')(session);
const logger = require('morgan');
const helper = require('./util/helper');
const values = require('./values');
const mongoose = require('mongoose');
const globalAlerts = require('./models/globalAlerts');
const indexRouter = require('./routes/index');
const alertRoute = require('./routes/alert');
const loginRoute = require('./routes/login');
const homeRoute = require('./routes/home');
const reportRoute = require('./routes/reports');
const adminRoute = require('./routes/admin');
const flash = require('connect-flash');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// session store
const store = new MongoDBStore({
    uri: values.mongoDbUri,
    collection: 'sessions'
});

// sessions
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', indexRouter);

app.use(loginRoute);
app.use(alertRoute);
app.use(homeRoute);
app.use('/admin', adminRoute);
app.use(reportRoute);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));

});


// TCP socket connection

client.connect(2324, '107.23.152.248', function () {
    console.log('Connected');
    client.write(JSON.stringify(values.msg_auth));
});
client.on('error', (error) => {
    console.log("Error");
    console.log(error);

});
client.on('data', function (data) {

    const str = (data.toString('utf-8').trim());


    // converting all the data to json data
    const jsonList = helper.toJson(str);

    // inserting all the fetched results into global Alerts collection
    globalAlerts.insertMany(jsonList).then(res => {

    }).catch(err => {
        console.log(err);
        console.log("error");
    });

    //client.destroy(); // kill client after server's response
});

client.on('close', function () {
    console.log('Connection closed');
});





// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


mongoose
    .connect(
        values.mongoDbUri
    )
    .then(result => {
        console.log("connected");
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

module.exports = app;
