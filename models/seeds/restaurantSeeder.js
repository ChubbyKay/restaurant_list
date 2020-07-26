const Restaurant = require('../restaurant')
const restaurantList = require('./restaurant.json')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.error('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < restaurantList.results.length; i++) {
    Restaurant.create(restaurantList.results[i])
  }
  console.log('done!')
})

