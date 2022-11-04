const express = require('express')
const router = express.Router()

const user = {
  id: 1,
  mail: "test@mail.ru"
}

router.get('/login', (req, res) => {
  res.render('users/user', {
      title: 'Авторизация',
      user: user
  })
})

module.exports = router