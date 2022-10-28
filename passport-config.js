const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy


function initialize(passport, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = username
        if (user == null) {
            return done(null, false, { message: 'no such user' });
        }
        try {
            if (password == user.password) /* (await bcrypt.compare(password, user.password)) */ {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
                }
            }


    passport.use(new LocalStrategy(authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
            })
             
        }

        

module.exports = initialize
