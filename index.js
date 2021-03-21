const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const session = require('express-session');
const flash = require('connect-flash');
const csrf = require('csurf')
require("dotenv").config();

// create an instance of express app
let app = express();


// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
    express.urlencoded({
        extended: false
    })
);

// set up sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(flash());

// enable CSRF
app.use(csrf());

// Register Flash middleware
app.use(function (req, res, next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
});

// Share the user data with hbs files
app.use(function(req,res,next){
    res.locals.user = req.session.user;
    next();
})

// import in routes
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');

async function main() {
    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);
}

main();

app.listen(3000, () => {
    console.log("Server has started");
});