const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cors = require('cors');
// const session = require('express-session'),
//     RedisStore = require('connect-redis')(session),
//     myRedis = require('./appset/db/redis');

const nodeConst = require('./appset/global/NodeConst');
const params = require('./appset/global/Params');
params.env = process.env.NODE_ENV;
console.log("app, env : " + params.env);

const app = express();
/*
// redirect http to https
if (params.env === 'production') {
    app.use(function(req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(['https://', req.get('Host'), req.url].join(''));
        }
        return next();
    });
}
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '100mb'})); // 100메가 데이터 제한
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use(cookieParser());
app.use(cors());
/*
app.use(
    session({
        store: new RedisStore(
            params.env === 'production' ? myRedis.config.production : myRedis.config.development
        ),
        secret: ''+new Date().getTime(),
        cookie: {secure: false},
        resave: true,
        saveUninitialized: true
}));
*/
app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/daum_address', require('./routes/daum_address'));
app.use('/api/auth', require('./routes/auth'));
app.get('/egnahcpw/:param', function(req, res){ // PASSWORD CHANGE url
    let url = req.params.param;
    if(params.env === 'production') {
        url = nodeConst.url.production + "egnahcpw/" + url;
    } else {
        url = nodeConst.url.development + "egnahcpw/" + url;
    }

    // TODO
    // 1. url로 find_pw 테이블 검사해서 있으면 user_id 가져오고 지워줌.
    // 2. users table user_id 암호 123456으로 리셋 시켜줌.
    res.end("your password has changed");
});
app.get('*', function(req, res){
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'))
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
