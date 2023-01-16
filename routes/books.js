const express = require('express')
const router = express.Router() 
const fileMulter = require('../middleware/file')
const fs = require('fs')
const counter = require('./requestCount')

const Books = require('../models/books')

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
    
      counter.getCounter(id, (resp) => {
        if (resp.statusCode !== 500) {
          resp.on('data', (d) => {
            console.log(`Запрос счетчика прошел успешно, cnt - ${JSON.parse(d).count}`);
            res.render('books/view', {
              title: 'Просмотр книги',
              book: books,
              count: Number(JSON.parse(d).count) + 1
            })
          })
          counter.setCounter(id);
        } else {
          res.render('books/view', {
            title: 'Просмотр книги',
            book: books,
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
