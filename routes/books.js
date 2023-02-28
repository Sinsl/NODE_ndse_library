const express = require('express')
const router = express.Router() 
const counter = require('./requestCount')

const Books = require('../models/books')
const Message = require('../models/message')

router.get('/', async (req, res) => {
  try {
    const books = await Books.find().select('-__v');
    res.render('books/index', {
      title: 'Книги',
      arrBooks: books,
    })
  } catch (e) {
    res.status(500).json(e);
  }
})

router.get('/create', (req, res) => {
  res.render('books/create', {
    title: 'Добавить книгу',
    book: {},
  })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;

    try {
      const books = await Books.findById(id).select('-__v');
      if(!books) {
        res.redirect('/err404')
      } 
      const messages = await Message.find({roomId: id}).select('-__v')
    
      counter.getCounter(id, (resp) => {
        if (resp.statusCode !== 500) {
          resp.on('data', (d) => {
            res.render('books/view', {
              title: 'Просмотр книги',
              book: books,
              count: Number(JSON.parse(d).count) + 1,
              user: req.user,
              arrMsg: messages
            })
          })
          counter.setCounter(id);
        } else {
          res.render('books/view', {
            title: 'Просмотр книги',
            book: books,
            arrMsg: messages,
            count: ''
          })
        }
      });
    } catch (e) {
      res.status(500).json(e);
    }    
})

router.get('/:id/download', async (req, res) => {

  const { id } = req.params;

    try {
      const books = await Books.findById(id).select('-__v');
      if(!books) {
        res.status(404)
        res.json('404 | книга не найдена')
      } 
      const fileName = books.fileName
      const filePath = books.filePath
      res.download(filePath, 'public/books/' + fileName)
    }  catch (e) {
      res.status(500).json(e);
    }     
})

router.get('/update/:id', async (req, res) => {
  const { id } = req.params
  try {
    const books = await Books.findById(id).select('-__v');
    if(!books) {
      res.redirect('/err404')
    } 
    res.render('books/update', {
      title: "Редактировать книгу",
      book: books
    })
  } catch (e) {
    res.status(500).json(e);
  }  
})

module.exports = router
