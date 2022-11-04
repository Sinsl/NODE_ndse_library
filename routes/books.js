const express = require('express')
const router = express.Router() 
const { v4: uuid } = require('uuid')
const fileMulter = require('../middleware/file')
const fs = require('fs')

class Book {
    constructor(title = "", description = "", authors = "", favorite = "", fileCover = "", fileName = "", fileBook = "", id = uuid()) {
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
        this.id = id
    }
}
const stor = {
    books: [
        new Book(),
        new Book(),
    ],
};


router.get('/', (req, res) => {
    const {books} = stor
    res.json({books})
})

router.get('/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if( idx !== -1) {
        res.json(books[idx])
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }

})

router.get('/:id/download', (req, res) => {
  const {books} = stor
  const {id} = req.params
  const idx = books.findIndex(el => el.id === id)
  if (idx !== -1){
    const fileName = books[idx].fileName
    const fileBook = books[idx].fileBook
    res.download(fileBook, 'public/books/' + fileName)
  } else {
    res.status(404)
    res.json('404 | книга не найдена')
}
})


router.post('/',
  fileMulter.single('fileBook'),
  (req, res) => {
    const {books} = stor
    const {title, description, authors, favorite, fileCover} = req.body
    let fileName = ""
    let fileBook = ""
    if (req.file) {
      fileName = req.file.originalname
      fileBook = req.file.path
    }

    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
    books.push(newBook)

    res.status(201)
    res.json({newBook})
  })

router.put('/:id',
  fileMulter.single('fileBook'),
  (req, res) => {
    const {books} = stor
    const {title, description, authors, favorite, fileCover} = req.body
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1){
      let fileName = books[idx].fileName
      let fileBook = books[idx].fileBook
      if (req.file) {
        console.log(fileName)
        if (fileBook !== "") {
          fs.unlink(fileBook, (err) => {
            if (err) throw err;
          })
        }
        fileName = req.file.originalname
        fileBook = req.file.path
    }
      books[idx] = {
        ...books[idx],
        title, 
        description, 
        authors, 
        favorite, 
        fileCover, 
        fileName,
        fileBook
      }
      res.json(books[idx])
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }
  })

router.delete('/:id',
fileMulter.single('fileBook'),
(req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)
     
    if(idx !== -1){
      if (books[idx].fileBook !== "") {
        fs.unlink(books[idx].fileBook, (err) => {
          if (err) throw err;
        })
      }
      books.splice(idx, 1)
        res.json(true)
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }
})

module.exports = router