const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan")
const mongoose = require("mongoose");
const db = require("./config/dbConfig").mongoURL;
require('dotenv').config();
const redis = require('redis');


//Route
const userRoutes = require('./routes/user');

const port = process.env.DB_PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port : ${port}`)
})

const client = redis.createClient(process.env.PORT_REDIS, process.env.HOST_REDIS);
client.on('connect', function() {
    console.log('Connected!');
  });
  
mongoose
    .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("mongoDB Connected"))
    .catch((err) => console.log(err));

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
    next();
});

//Testing API
app.get('/', (req, res) => {
    res.send('Apps its working')
    console.log("Apps its working")
})

app.use('/user', userRoutes)