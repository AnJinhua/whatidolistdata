const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const passport = require('passport')
const { Server } = require('socket.io')
const { cloudinary } = require('./config/cloudinary')

const session = require('express-session')
const cors = require('cors')
const router = require('./router')

const socketEvents = require('./socketEvents')
const config = require('./config/main')
const path = require('path')
const bodyParser = require('body-parser')

// Database Setup
//local db -> mongodb://localhost/donnyslist
mongoose
  .connect(
    'mongodb+srv://test:a48571YmF0P26ioQ@db-mongodb-nyc1-02623-aa7725cd.mongo.ondigitalocean.com/donnyslist?tls=true&authSource=admin&replicaSet=db-mongodb-nyc1-02623',
    {
      // config.DB_URI ||
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log('database is connected!')
  })
  .catch((err) => {
    console.log('database not ready!')
    console.error(err.message)
  })

// Start the server
let server
const app = express()

const corsOptions2 = {
  origin: config.website_url,
  credentials: true,
}

const corsOptions = {
  allRoutes: true,
  origin: config.website_url,
  methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  headers: 'Origin, X-Requested-With, Content-Type, Accept, Engaged-Auth-Token',
  credentials: true,
}

app.use(cors(corsOptions2))

if (process.env.NODE_ENV !== config.test_env) {
  server = app.listen(process.env.PORT || config.port)
  console.log(`your server is running on port ${config.port}.`)
} else {
  server = app.listen(config.test_port, '0.0.0.0')
}

const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  pingTimeout: 30000,
  maxHttpBufferSize: 5e6,
})
socketEvents(io)

app.set('trust proxy', 1) // trust first proxy

app.use(
  session({
    secret: 'secretcode',
    resave: false,
    saveUninitialized: true,
    proxy: true,
    name: 'DonnieslistCookies',
    cookie: {
      // sameSite: 'none',
      // secure: true,
      // httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
    },
  })
)

// Set static file location for production
// app.use(express.static(__dirname + '/public'));

app.use(express.static('public'))
app.use('/public', express.static(path.join(__dirname, '../client/public')))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.set('view engine', 'ejs')

// Setting up basic middleware for all Express requests
app.use(express.urlencoded({ extended: true, limit: '500mb' })) // Parses urlencoded bodies
app.use(
  express.json({
    limit: '500mb',
    verify: (req, res, buf) => {
      req.rawBody = buf
    },
  })
) // Send JSON responses

app.use(logger('dev')) // Log requests to API using morgan

app.post('/files/upload', async (req, res) => {
  try {
    const fileStr = req.body.data
    const uploadResponse = await cloudinary.uploader.upload(fileStr)
    res.json({ msg: 'uploaded', success: true, ...uploadResponse })
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

// Enable CORS from client-side
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
//   )
//   res.header('Access-Control-Allow-Credentials', 'true')
//   next()
// })
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

// Import routes to be served
router(app)

// necessary for testing
module.exports = server
