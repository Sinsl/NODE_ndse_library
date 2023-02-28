const express = require('express')
const router = express.Router()
const passport = require('../middleware/user')

router.get('/', (req, res) => {
  res.render('users/user', {
      title: 'home',
      user: req.user
  })
})

router.get('/login', (req, res) => {
  res.render('users/login', {
      title: 'Авторизация'
  })
})

router.get('/current',
(req, res) => {
  res.json({id: req.user._id})
})

router.post('/login', 
 passport.authenticate('local', { failureRedirect: '/user/login', failureMessage: true }),
(req, res) => {
  console.log('Авторизация')
  console.log(req.user)
  const { current_url } = req.body
  const redirectUrl = (current_url ? current_url : '/user')
  res.redirect(redirectUrl)
})

router.get('/register', (req, res) => {
  res.render('users/register', {
      title: 'Регистрация'
  })
})

router.post('/register',
passport.authenticate('signup', { failureRedirect: '/user/register', failureMessage: true }),
(req, res) => {
  console.log('Регистрация')
  console.log(req.user)
  const { current_url } = req.body
  const redirectUrl = (current_url ? current_url : '/user')
  res.redirect(redirectUrl)
})

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err) }
    res.redirect('/user')
  })
})

router.get('/profile',
(req, res, next) => {
  if(!req.isAuthenticated()){
    console.log('Не авторизирован для перехода на профиль')
    return res.redirect('/user/login')
  }
  next()
},
(req, res) => {
  res.render('users/profile', {
    title: 'Профиль',
    user: req.user
  })
}
)

module.exports = router