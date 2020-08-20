const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  // 登入 => 確認帳號密碼是否正確
  // usernameField 意思？？？
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered!' })
        } // 加入 bcrypt，比對密碼是否正確 => 第一個參數是使用者的輸入值，第二個參數是資料庫的雜湊值
        return bcrypt.compare(password, user.password)
          // 比對完回傳回布林值，這裡用 isMatch 代表
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, { message: 'Email or Password is incorrect.' })
            }
            return done(null, user)
          })
      })
      .catch(err => done(err, false))
  }))

  // 正序 反序
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}
