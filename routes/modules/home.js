const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// 首頁載入頁面
router.get('/', (req, res) => {
  // console.log(req.param)
  Restaurant.find()
    .lean()
    // .sort({ _id: 'asc' })
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.error(error))
})

// search
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  console.log(req.query.keyword)
  return Restaurant.find({ name: { $regex: keyword, $options: "i" } })
    .lean()
    .then(restaurant => res.render('index', { restaurant }))
    .catch(error => console.log(error))
})

// sort
router.get('/sort/:type/:mode', (req, res) => {
  const sortType = {
    name: '餐廳名稱',
    category: '類別',
    location: '地區'
  }

  const sortMode = {
    asc: 'A -> Z',
    desc: 'Z -> A',
  }

  const type = req.params.type
  const mode = req.params.mode
  // console.log('type 值：', type, ', mode值:', mode)
  const sortOption = `${sortType[type]}:${sortMode[mode]}`


  return Restaurant.find()
    .lean()
    .sort({ [type]: [mode] })
    .then(restaurant => res.render('index', { restaurant, sortOption }))
    .catch(error => console.log(error))
})

// const sortOption = {
//   ascend: 'A -> Z',
//   descend: 'Z -> A',
//   category: '類別',
//   location: '地區'
// }

// const optionAscend = document.getElementById('ascend')
// const optionDescend = document.getElementById('descend')
// const optionCategory = document.getElementById('category')
// const optionLocation = document.getElementById('location')

// function sortSelected() {
//   if (optionAscend) {
//     return `${sortOption.ascend}`
//   } else if (optionDescend) {
//     return `${sortOption.descend}`
//   } else if (optionCategory) {
//     return `${sortOption.category}`
//   } else {
//     return `${sortOption.location}`
//   }

// }

module.exports = router

