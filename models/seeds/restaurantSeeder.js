const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant')
const restaurantList = require('./restaurant.json')
const User = require('../user')

const db = require('../../config/mongoose')

const SEED_USER =
  [{
    name: 'User_01',
    email: 'user1@example.com',
    password: '12345678',
  },
  {
    name: 'User_02',
    email: 'user2@example.com',
    password: '12345678',
  }]

db.once('open', () => {
  Promise.all(Array.from(
    { length: 2 },
    (_, i) =>
      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(SEED_USER[i].password, salt))
        .then(hash => User.create({
          name: SEED_USER[i].name,
          email: SEED_USER[i].email,
          password: hash
        }))
        .then(user => {
          const userId = { userId: user._id }
          let restaurantOwner = []
          restaurantList.results.forEach(data => {
            if (user.name === 'User_01' && data.id <= 3) {
              data = Object.assign(data, userId)
              restaurantOwner.push(data)
            }
            else if (user.name === 'User_02' && data.id > 3) {
              data = Object.assign(data, userId)
              restaurantOwner.push(data)
            }
          })
          return Promise.all(Array.from(
            { length: 3 }, (_, i) => Restaurant.create(restaurantOwner[i]))
          )
        })
        .then(() => {
          console.log('done.')
          process.exit()
        })
  ))
})