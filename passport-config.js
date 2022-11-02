//Load environment variable
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
  }

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy

function initialize(passport, getUserByUsername, getUserById) {
    
    const authenticateUser = async (username, password, done) => {
        const user = getUserByUsername(username)
        console.log(user)
        if (user == null) {
            return done(null, false, { message: 'no such user' });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
                }
            }
            
    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
          return done(null, getUserById(id));
              });

               
        }


module.exports = initialize