const express = require('express')

const logger = require('./middleware/logger')
const error404 = require('./middleware/err-404')
const userRouter = require('./routes/user')
const booksRouter = require('./routes/books')
const indexRouter = require('./routes/index')

const app = express()
app.use(express.urlencoded())
app.set('view engine', 'ejs')

app.use(logger)

app.use('/', indexRouter)
app.use(express.static(__dirname + '/src/css/'))
app.use('/user', userRouter)
app.use('/books', booksRouter)

app.use(error404)

const PORT = process.env.PORT || 3000
app.listen(PORT)
