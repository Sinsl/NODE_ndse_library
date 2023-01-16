const express = require('express')
const router = express.Router() 
const fileMulter = require('../middleware/file')
const fs = require('fs')
const counter = require('./requestCount')

const Books = require('../models/books')

router.post('/',
  fileMulter.single('fileBook'),
  async (req, res) => {
    const {title, description, authors, favorite, fileCover} = req.body
    let fileName = ""
    let filePath = ""
    if (req.file) {
      fileName = req.file.originalname
      filePath = req.file.path
    }

    const newBook = new Books({title, description, authors, favorite, fileCover, fileName, filePath})

    try {
      await newBook.save();
      res.redirect('/books');
    } catch (e) {
      res.status(500).json(e);
    }
  })

router.post('/update/:id',
  fileMulter.single('fileBook'),
  async (req, res) => {
    console.log('Попали в метод пут правильно')
    const { id } = req.params
    const { title, description, authors, favorite, fileCover } = req.body
    try {
      const books = await Books.findById(id).select('-__v');
      if(!books) {
        res.redirect('/err404')
      } 
      let fileName = books.fileName
      let filePath = books.filePath
      if (req.file) {
          if (filePath !== "") {
            fs.unlink(filePath, (err) => {
              if (err) throw err;
            })
          }
        fileName = req.file.originalname
        filePath = req.file.path
      }
      await Books.findByIdAndUpdate(id, {title, description, authors, favorite, fileCover, fileName, filePath});
      res.redirect('/books')
    } catch (e) {
      res.status(500).json(e);
    }  
})

router.post('/delete/:id', async (req, res) => {
  console.log('Попали в метод delete правильно')
    const { id } = req.params
    try {
      const books = await Books.findById(id).select('-__v');
      if(!books) {
        res.redirect('/err404')
      } 
      const result = await Books.deleteOne({ _id: id });
      if(result.acknowledged) {
        if (books.filePath !== "") {
          fs.unlink(books.filePath, (err) => {
            if (err) throw err;
          })
        }
      }
      res.redirect('/books')
    } catch (e) {
      res.status(500).json(e);
    }  
})

module.exports = router