const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')

module.exports = app => {
  // 初始化 passport 模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略 => 確認帳號密碼是否正確
  // usernameField => 預設為 username:username 此處更改為 email
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
  // 用 facebook 帳號登入
  passport.use(
    new FacebookStrategy({
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      // 在用戶端 OAuth 設定的重新導向 URI，在本地開發實不需另作設定，但若網站正式上線則需至 facebook developers 設定
      callbackURL: process.env.FACEBOOK_CALLBACK,
      // 向 facebook 要求公開得資料，包含 email 及 用戶顯示名稱
      profileFields: ['email', 'displayName']
    }, (accessToken, refreshToken, profile, done) => {
      const { name, email } = profile._json
      User.findOne({ email })
        .then(user => {
          // 確認使用者存在
          if (user) return done(null, user)
          // 因為網站的註冊項目必填 email ，但從 FB 登入的用戶沒有密碼，所以用 randomPassword 製作一個隨機密碼
          const randomPassword = Math.random().toString(36).slice(-8)
          bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => User.create({
              name, email, password: hash
            }))
            .then(user => done(null, user))
            .catch(err => done(err, false))
        })
    }
    ))


  // 設定 序列化 與 反序列化
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
