const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv')
const connectDB = require('./config/db')

const postsRoutes = require('../nodeserver/routes/posts') 

//atlas pw igxQtkHMS1DGKddF const uri = "mongodb+srv://<username>:<password>@cluster0.mzdpt.mongodb.net/<dbname>?retryWrites=true&w=majority";

dotenv.config({ path: './config/config.env' })

connectDB()

const app = express();

// mongoose
//   .connect(
//     "mongodb://k00l:igxQtkHMS1DGKddF@cluster0-shard-00-00.mzdpt.mongodb.net:27017,cluster0-shard-00-01.mzdpt.mongodb.net:27017,cluster0-shard-00-02.mzdpt.mongodb.net:27017/opmdb?ssl=true&replicaSet=atlas-dvcex0-shard-0&authSource=admin&retryWrites=true&w=majority",
//     { useNewUrlParser: true }
//   )
//   .then(() => {
//     console.log("Connected to database!");
//   })
//   .catch(error => {
//     console.log("Connection failed!", error);
//   });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join('images')));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
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

const PORT = process.env.PORT || 3000


app.listen(PORT, () => {
  console.log(`Server up on ${PORT}` )
})