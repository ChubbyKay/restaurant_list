const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const restaurantList = require('./models/seeds/restaurant.json')
const Restaurant = require('./models/restaurant')
const routes = require('./routes')

require('./config/mongoose')

const app = express()

const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

//search
// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword
//   return Restaurant.find({ name: { $regex: keyword, $options: "i" } })
//     .lean()
//     .then(restaurant => res.render('index', { restaurant }))
//     .catch(error => console.log(error))
// })

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
