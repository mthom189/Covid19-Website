//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const connectionRoutes = require('./routes/connectionRoutes');
const userRoutes = require('./routes/userRoutes');
const {initCollection} = require('./models/tests');
//create app
const app = express()

//configure app
let port = 8084;
let host = 'localhost';
let url = 'mongodb://localhost:27017';
app.set('view engine', 'ejs');
//mount middlware
app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb://localhost:27017'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//connect to mongo
mongoose.connect('mongodb://localhost:27017/NBAD',
    {})
.then(() =>{
    app.listen(port, host, ()=>{
    });
})
.catch(err=> console.log(err.message));        

app.use('/connection', connectionRoutes);
app.use('/users', userRoutes);


//set up routes
app.get('/', (req, res)=>{
    res.render('index');
});

app.get('/about', (req, res)=> {
    res.render('./general/about');
});
app.get('/contact', (req, res)=> {
    res.render('./general/contact');
});

app.use((req, res, next)=>{
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err})
});
