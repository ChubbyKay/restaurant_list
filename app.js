const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const routes = require('./routes')
const { use } = require('passport')

const usePassport = require('./config/passport')
require('./config/mongoose')

const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'Secret',
  resave: false,
  saveUninitialized: true
}))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)

// 登入後的客製化顯示
app.use((req, res, next) => {
  // res.locals 是 express.js 的語法，意即放在 res.locals 的變數，在所有 views 都可使用
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user // req.user 是來自 passport 的反序列化時取出的
  next()
})

app.use(routes)

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
