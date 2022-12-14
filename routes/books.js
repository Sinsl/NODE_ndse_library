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
        new Book('Понедельник начинается в субботу', 'Юмористическая повесть', 'Братья Стругацкие'),
        new Book('Мастер и Маргарита', 'Роман в русле магического реализма', 'М.А. Булгаков'),
    ],
};


router.get('/', (req, res) => {
    const {books} = stor
    res.render('books/index', {
      title: 'Книги',
      arrBooks: books,
    })
})

router.get('/create', (req, res) => {
  res.render('books/create', {
    title: 'Добавить книгу',
    book: {},
  })
})

router.post('/create',
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

    res.redirect('/books')
  })


router.get('/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if( idx === -1) {
        res.redirect('/err404')
    } 
    
    res.render('books/view', {
      title: 'Просмотр книги',
      book: books[idx]
    })
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

router.get('/update/:id', (req, res) => {
  const {books} = stor
  const {id} = req.params
  const idx = books.findIndex(el => el.id === id)

  if (idx === -1) {
    res.redirect('/err404')
  }

  res.render('books/update', {
    title: "Редактировать книгу",
    book: books[idx]
  })
})


router.post('/update/:id',
  fileMulter.single('fileBook'),
  (req, res) => {
    const {books} = stor
    const {title, description, authors, favorite, fileCover} = req.body
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx === -1){
      res.redirect('/err404')
    }

    let fileName = books[idx].fileName
    let fileBook = books[idx].fileBook
    if (req.file) {
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
    res.redirect('/books')
})

router.post('/delete/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)
    
    if (idx === -1){
      res.redirect('/err404')
    }

    if (books[idx].fileBook !== "") {
      fs.unlink(books[idx].fileBook, (err) => {
        if (err) throw err;
      })
    }
    books.splice(idx, 1)
    res.redirect('/books')
})

module.exports = router