// facebook 認證路由
const express = require('express')
const router = express.Router()

const passport = require('passport')

// 向 facebook 要求傳送使用者的 email 和 profile
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

// facebook 把資料發回來
// 若認證成功導去'/'，失敗就導回'login'
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: 'users/login'
}))

module.exports = router