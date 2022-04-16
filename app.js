const express = require('express');
const app = express();
const dotenv = require('dotenv').config();

//session işlemleri için gereken paket
const session = require('express-session');
const flash = require('connect-flash')
const path = require('path')

const passport = require('passport');

//db bağlantısı
const database = require('./config/db');

//routes
const router = require('./src/routers/router');

//Routes
//app.use(router);
const validateMiddleware = require('./src/middlewares/validation_middleware');

const assosication = require('./models/assosications');

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const myStore = new SequelizeStore({
	db: database,
});

//session ve flash message
app.use(session(
    {
      secret: process.env.SESSION_SECRET,
      resave : false,
      saveUninitialized: true,
      cookie: {
          maxAge:1000 * 60 * 60 * 24
      },
      store: myStore
    }
));
// veritabanı tablosu oluştur
myStore.sync();


app.use(flash());


//passport-local için atama yaparız
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {

    res.locals.error = req.flash('error');
    next();
})

app.use(express.json()); //Gönderilen isteğin bodysini parse etmek için kullanılır
app.use(express.urlencoded({ extended: true})); //Gönderilen isteğin bodysini parse etmek için kullanılır

//app.use('/', require('./src/routers/auth_router')
app.use('/', require('./src/routers/router'))

app.get('/', (req, res) => {
    res.status(200).json({'mesaj': 'hoşgeldiniz'})
});




app.listen(3000, () => {
    console.log("3000 portundan server ayaklandı");
});