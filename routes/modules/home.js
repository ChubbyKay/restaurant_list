const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.error(error))
})

//search
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  return Restaurant.find({ name: { $regex: keyword, $options: "i" } })
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.log(error))
})

module.exports = router

