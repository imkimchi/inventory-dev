import { Strategy as LocalStrategy } from 'passport-local'
import passport from 'koa-passport'
import User from '../models/user'

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

passport.use(new LocalStrategy(async (username, password, done) => {
  console.log(`username is ${username}, password is ${password}`)
  const user = await User.findOne({'email': username})

  if (!user) { return done(null, false, 'Incorrect email') }
  if (!user.validatePassword(password)) { return done(null, false, 'Incorrect password') }

  return done(null, user)
})
)
