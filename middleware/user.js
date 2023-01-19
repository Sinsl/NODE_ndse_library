const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/user')

const verifyPassword = (user, password) => {
  return user.password === password
}

passport.use('local', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, 
(username, password, done) => {
  User.findOne({ email: username }, (err, user) => {
    if (err) { return done(err) }
    if(!user) { return done(null, false) }
    if (!verifyPassword(user, password)) {
      return done(null, false)
    }

    return done(null, user)
  })       
}))

passport.use('signup', new localStrategy({
  passReqToCallback : true
},
(req, username, password, done) => {
    User.findOne({ email: username}, (err, user) => {
      if (err){
        console.log('Error in SignUp: '+err);
        return done(err);
      }
      if (user) {
        console.log('User already exists');
        return done(null, false);
      } else {
        const newUser = new User();
        newUser.email = username;
        newUser.password = password;
        if (req.body.nickname !== ''){
          newUser.nickname = req.body.nickname
        } else {
          const arr = username.split('@')
          newUser.nickname = arr[0]
        }
      
        newUser.save((err) => {
          if (err){
            console.log('Error in Saving user: '+err);  
            throw err;  
          }
          console.log('User Registration succesful');    
          return done(null, newUser);
        });
      }
    });
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
})

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err) }
    cb(null, user)
  });
});

module.exports = passport