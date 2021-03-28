const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const session = require('express-session');
const FileStore = require('session-file-store')(session);
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
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}))

// initialise file stores for session


app.use(flash());

// enable CSRF
// we use our own CSRF proxy so that some routes are
const csrfInstance = csrf();
app.use(function (req, res, next) {
  // exclude /checkout/process_payment for CSRF
  if (req.url === '/checkout/process_payment') {
      return next()
  }
  csrfInstance(req, res, next)
})

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

// Share CSRF with hbs files
app.use(function(req,res,next){
    // don't set CSRF token if it is not included
    if (req.csrfToken) {    
          res.locals.csrfToken = req.csrfToken();
    }  
    next();
})

// import in routes
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cloudinaryRoutes = require('./routes/cloudinary');
const shoppingCartRoutes = require('./routes/shoppingCart');
const checkoutRoutes = require('./routes/checkout');

async function main() {
    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);
    app.use('/cloudinary', cloudinaryRoutes);
    app.use('/cart', shoppingCartRoutes);
    app.use('/checkout', checkoutRoutes);
}

main();

app.listen(3000, () => {
    console.log("Server has started");
});