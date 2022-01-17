const express = require('express');
const app = express();
const morgan = require('morgan'); // morgan is a debbaging tool that send a message 
const mongoose = require('mongoose');
const checkAuth = require('./api/middlewares/checkAuth');


mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@articles-api.m0jwu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

    // index the DB. importent for the email column to be unique!
    // useCreateIndex: true, //depercated
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB Connected!');
})
const articlesRoutes = require('./api/routes/articles') //import route articles
const categoriesRoutes = require('./api/routes/categories');
const usersRoutes = require('./api/routes/users');
app.use(express.json()); // middleware to handle json

app.use(express.urlencoded({ // middleware to handle diffrent types than json, like url
    extended: false // change nessage prezentation, better on false 
}));

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads')); // middleware for uploaded images
// app.use('/', express.static('uploads')); 

//middleware  - allow us to access to router on local host 3000 from client with diffrent localhost like 4000
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*") // allow access to all origins ( "*" )
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization") // define what types of headers to recive
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next(); // continue the express flow to the next middleware
});





//routes
app.use('/articles', articlesRoutes);
app.use('/categories', checkAuth, categoriesRoutes);
app.use('/users', usersRoutes);

// middleware for unvalid path in app
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;