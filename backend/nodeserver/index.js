const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv')
const logger = require('express-logger')
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db')

const postsRoutes = require('./routes/posts') 
const usersRoutes = require('./routes/users')
const profileRoutes = require('./routes/profile')

const twoauth = require('./oauth/twoauth')
const fboauth = require('./oauth/fboauth')

dotenv.config({ path: './config/config.env' })

connectDB()

const app = express();

app.use(cors())



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/backend/nodeserver/images", express.static('images'))

// app.use("/images", express.static(path.join("nodeserver/images")));
//app.use(session({ secret: 'feeling hot hot hot' }));


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

app.use(logger({ path: "log/express.log" }));
app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


app.use("/api/postTask", postsRoutes)
app.use("/api/user", usersRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/", twoauth)
app.use("/api/", fboauth)

// const PORT = process.env.PORT || 3000


// app.listen(PORT, () => {
//   console.log(`Server up on ${PORT}` )
// })

module.exports = app


//atlas pw igxQtkHMS1DGKddF const uri = "mongodb+srv://<username>:<password>@cluster0.mzdpt.mongodb.net/<dbname>?retryWrites=true&w=majority";
