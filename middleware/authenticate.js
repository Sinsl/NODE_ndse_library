const passport = require('./user')

exports.authLogin = passport.authenticate('local', { failureRedirect: '/user/login', failureMessage: true })
exports.authRegister = passport.authenticate('signup', { failureRedirect: '/user/register', failureMessage: true })