const express = require('express')
const router = express.Router()
// const User = require('../../models/user')

// login page
router.get('/login', (req, res) => {
  res.render('login')
})

// login button
router.post('/login', (req, res) => {

})

// register page
router.get('/register', (req, res) => {
  res.render('register')
})

module.exports = router
