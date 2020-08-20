const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

// login page
router.get('/login', (req, res) => {
  res.render('login')
})

// login feature
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: 'users/login'
}))

// register page
router.get('/register', (req, res) => {
  res.render('register')
})

// register feature
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push({ message: '請確實填寫 email、password、confirm password 欄位' })
  } if (password !== confirmPassword) {
    errors.push({ message: '請再次確認密碼' })
  } // 若errors.length = true 代表上述判斷式有誤，則跳回 register 頁面
  if (errors.length) {
    return res.render('register', {
      errors, name, email, password, confirmPassword
    })
  }
  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了' })
      return res.render('register', {
        errors, name, email, password, confirmPassword
      })
    } // 加密
    return bcrypt
      .genSalt(10) // 加「鹽」，複雜度係數為 10
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name, email, password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

// logout 
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已成功登出帳號 ：）')
  res.redirect('/users/login')
})

module.exports = router
