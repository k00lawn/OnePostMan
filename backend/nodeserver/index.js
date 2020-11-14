const express = require('express');
//const session = require('express-session')
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv')
const passport = require('passport')
const connectDB = require('./config/db')

const postsRoutes = require('../nodeserver/routes/posts') 
const usersRoutes = require('../nodeserver/routes/users')
const twoauth = require('./oauth/twoauth')

dotenv.config({ path: './config/config.env' })

connectDB()

const app = express();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join('images')));
//app.use(session({ secret: 'feeling hot hot hot' }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use("/api/postTask", postsRoutes)
app.use("/api/user", usersRoutes)
app.use("/", twoauth)

const PORT = process.env.PORT || 3000


app.listen(PORT, () => {
  console.log(`Server up on ${PORT}` )
})


//atlas pw igxQtkHMS1DGKddF const uri = "mongodb+srv://<username>:<password>@cluster0.mzdpt.mongodb.net/<dbname>?retryWrites=true&w=majority";
