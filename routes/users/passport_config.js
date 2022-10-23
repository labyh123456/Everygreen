const LocalStrategy = require('passport-local').Strategy;
// const CryptoJS = require('crypto-js');
const bcrypt = require('bcrypt');
// const User = require('../../modal/User');
const User = require('../../modal/User');
 function initialize(passport) {

    const authenticateUser = async (email, password, done) => {
      let user = await User.findOne({email:email});
        if (user == null)
            return done(null, false, { message: 'No User With That Email ' })
            try {
              console.log(password, user.password)
                if (await bcrypt.compare(password, user.password)) {
                  console.log('succeess')
                  return done(null, user)
                } else {
                  return done(null, false, { message: 'Password incorrect' })
                }
              } catch (e) {
                return done(e)
              }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' },
        authenticateUser))
  
        passport.serializeUser(function(user, done) {
          console.log('in passprt config', user);
          done(null, user.id);
          // if you use Model.id as your idAttribute maybe you'd want
          // done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
  
        return  done(err, user);
        });
      });
}
module.exports = initialize