// packages import
import MongoStore from "connect-mongo"
import express from "express"
import handlebars from "express-handlebars"
import session from "express-session"
import passport from "passport"
import cors from "cors"
// config imports
import { __dirname } from "./utils/utils.js"
import { initializePassport } from "./config/passport.config.js"
import { mongoURL, serverPort } from "./config/main.config.js"
// routes and middleware imports
import logger from "./utils/logger.js"
import { auth } from "./middlewares/authentication.js"
import { errorHandler } from "./middlewares/error.js"
import loginRouter from "./routes/login.router.js"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import usersRouter from "./routes/users.router.js"
import loggerRouter from "./routes/logger.router.js"
import PersistenceService from "./services/index.js"

// Definimos el servidor HTTP
const server = express()

// Iniciamos mongo, motor de plantillas, passport, session y otras utilidades
server.use(session({
  store: MongoStore.create({
    mongoUrl: mongoURL,
    dbName: 'DB',
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }),
  secret: 'libreriapop',
  resave: true,
  saveUninitialized: true
}))
server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(express.static(__dirname + '/public'))
initializePassport()
server.use(passport.initialize())
server.use(passport.session())
server.use(errorHandler)
server.engine('handlebars', handlebars.engine())
server.set('views', 'src/views')
server.set('view engine', 'handlebars')

// Definimos las rutas
server.use('/', loginRouter)
server.use('/api/products', auth, productsRouter)
server.use('/api/carts', auth, cartsRouter)
server.use('/api/users', auth, usersRouter)
server.use('/loggertest', loggerRouter)

// Arrancamos el servidor HTTP
let persistence = new PersistenceService()

const httpServer = server.listen(serverPort, () => {
  logger.info(`Server listening on port ${serverPort} - ${new Date().toLocaleTimeString()}`)
  logger.log('info', `Server listening on port ${serverPort} - ${new Date().toLocaleTimeString()}`)
})
