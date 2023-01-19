const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('./middleware/user')
const User = require('./models/user')

const logger = require('./middleware/logger')
const error404 = require('./middleware/err-404')
const userRouter = require('./routes/user')
const booksRouter = require('./routes/books')
const indexRouter = require('./routes/index')
const apiBooksRouter = require('./routes/apiBooks')

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.set('view engine', 'ejs')
app.use(session({secret: 'SECRET'}))
app.use(passport.initialize())
app.use(passport.session())

app.use(logger)

app.use('/', indexRouter)
app.use(express.static(__dirname + '/src/css/'))
app.use('/user', userRouter)
app.use('/books', booksRouter)
app.use('/api/books', apiBooksRouter)

app.use(error404)

mongoose.set('strictQuery', false);

async function start (PORT, UrlBD) {
  try {
    await mongoose.connect(UrlBD);
    app.listen(PORT);
    console.log(`Сервер запущен: внешний порт 8080, подключен к БД через порт ${UrlBD}`);
  } catch (e) {
    console.log('Ошибка подключения БД ', e);
  }
}

const UrlBD = process.env.UrlBD || 'mongodb://127.0.0.1:27017';
const PORT = process.env.PORT || 3000;
start(PORT, UrlBD);
