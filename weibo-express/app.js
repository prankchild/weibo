const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

const app = express();
// app.all('*', function (req, res, next) {
//   // 设置允许跨域的域名，*代表允许任意域名跨域
//   res.header('Access-Control-Allow-Origin', '127.0.0.1:3000')
//   // 允许的header类型
//   res.header('Access-Control-Allow-Headers', '*')
//   // 跨域允许的请求方式
//   res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
//   res.header('Access-Control-Allow-Credentials', 'true');
//   if (req.method.toLowerCase() === 'options') {
//     res.send(200)
//     // 让options尝试请求快速结束
//   } else {
//     next()
//   }
// })
//设置跨域请求
app.all('*', function (req, res, next) {
  let originHeader = req.headers.origin;
  console.log(originHeader);
  res.header("Access-Control-Allow-Origin", originHeader);
  // res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30 // 设置 session 的有效时间，单位毫秒
  },
  rolling: true
}))
// 创建Redis客户端
const redisClient = redis.createClient(6379, '127.0.0.1', { auth_pass: 'password' });
// 设置Express的Session存储中间件
app.use(session({ store: new RedisStore({ client: redisClient }), secret: 'password', resave: false, saveUninitialized: false }));
const http = require('http')
const server = http.createServer(app)
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

server.listen('3000', () => {
  console.log('Server running at  http://localhost:3000/')
})
