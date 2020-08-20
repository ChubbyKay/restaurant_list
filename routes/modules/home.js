const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// 首頁載入頁面
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.error(error))
})

// search
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  return Restaurant.find({ name: { $regex: keyword, $options: "i" } })
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.log(error))
})

// sort
router.get('/sort/:type/:mode', (req, res) => {
  const type = req.params.type
  const mode = req.params.mode

  const sortOption = {
    name_asc: 'A -> Z',
    name_desc: 'Z -> A',
    category_asc: '類別',
    location_asc: '地區'
  }
  const sortSelected = `${type}_${mode}`

  return Restaurant.find()
    .lean()
    .sort({ [type]: [mode] })
    .then(restaurant => res.render('index', { restaurant, sortOption: sortOption[sortSelected] }))
    .catch(error => console.log(error))
})

module.exports = router

