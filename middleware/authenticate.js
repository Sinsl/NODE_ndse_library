const passport = require('./user')

exports.autLogin = passport.authenticate('local', { failureRedirect: '/user/login', failureMessage: true })
exports.autRegister = passport.authenticate('signup', { failureRedirect: '/user/register', failureMessage: true })