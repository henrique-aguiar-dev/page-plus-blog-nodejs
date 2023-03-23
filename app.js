const dotEnv = require('dotenv')
dotEnv.config()
const express = require('express')
const app = express()
const path = require('path')
const routes = require('./routes/routes')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const rateLimit = require('express-rate-limit')

//Connect to MongoDB
mongoose.connect(process.env.CONNECTIONSTRING,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	}).then(() => {
		app.emit('pronto')
	}).catch(e => console.log(e))

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware')

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '100kb' }))
app.use(express.static(path.join(__dirname, 'public')))

// limit each IP to 100 max requests per hour
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000, // 1 Hour
	message: 'Too many requests'
})

app.use(limiter) //ENABLE ON PRODUCTION

//Sessions
const sessionOptions = session({
	secret: process.env.SESSIONSECRET,
	store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
	resave: false,
	saveUninitialized: false,
	sameSite: true,
	cookie: {
		maxAge: 1000 * 60 * 60 * 2, //2 hours
		httpOnly: true,
		//secure: true <<!!FLASH MESSAGES ON SESSION DOESN'T SHOW!>>
	}
})
app.use(sessionOptions);

//Flash messages
app.use(flash())

//View engine - EJS
app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

//Upload files
app.use(fileUpload())

//Init Csurf & middlewares
app.use(csrf())
app.use(middlewareGlobal)
app.use(checkCsrfError)
app.use(csrfMiddleware)

//Routes
app.use(routes)

//Server
app.on('pronto', () => {
	app.listen(process.env.PORT || 5000)
})
