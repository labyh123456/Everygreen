if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
const express = require('express');
const port = process.env.PORT || 8080;
const methodOverride = require('method-override');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const review = require('./modal/review');
const eBook = require('./modal/book');
const initializePassport = require('./routes/users/passport_config');
const flash = require('express-flash');
const passport = require('passport');
const session = require('express-session');
//configure bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({limit:'10mb', extended:false}))

//use method override
app.use(methodOverride('_method'));


// temp


initializePassport(
    passport
    // email => customer.find({email:email}), 
)


app.use(flash());


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // store:MongoStore.create({
    //     mongoUrl:process.env.DATABASE_URL
    // }),
    cookie:{maxAge: 180 * 60 * 1000}
}))
app.use(passport.initialize())
app.use(passport.session())
console.log('ddd1')
app.get('*', function(req, res, next){
    res.locals.cart = req.session.cart;
    next();
})
console.log('ddd2')


//import router files
const customer_register_Router = require('./routes/users/customer_register');
const indexRouter = require('./routes/users')
const frontRouter  = require('./routes/users/booksByCat');
const adminRouter = require('./routes/admin/index')
const userauth = require('./routes/users/auth');
const userHomePage = require('./routes/users/index');
const adminHomepage = require('./routes/admin/index');

const  user_management = require('./routes/admin/user_management');
const user_management_cru = require('./routes/createUser');
const user_management_edit = require('./routes/admin/edit');

// category_management
const  category_management = require('./routes/admin/category_management');
// const bookRouter = require('./routes/boks')

// Book management
const book_management  = require('./routes/admin/book_management');

//Customer Management
const customer_management = require('./routes/admin/customer_management');

//Review Management
const review_management = require('./routes/admin/review_management');

// order Management
const order_management = require('./routes/admin/order_management');


// register customer management
const register_customer_management = require('./routes/admin/register_customer_management');

// set the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

// public files
app.use(express.static('public'));

app.use(express.json());
// app.get('/', (req, res) => {
//     res.send('hello world can yo do bro right now if you can help ? because');
// })
console.log('hello dear');

app.locals.truncateText = function(text, length){
    var truncateText = text.substring(0, length);
    return truncateText;
}


// tempory function --------------------------
app.locals.Calculate_Reviews =  async function(book_id) {
    let rating  = 0.0;
    let sum = 0.0;
    const rev =  await review.find({bookid:book_id});
    // if(rev.length < 0)
    // return 0.0;
    rev.forEach(review => {
        rating = review.rating;
    })    
    return 56;
}


// -------------------------------------------------


global.myvar = false;

// import db 
const mongoose = require("mongoose");

mongoose

    .connect(process.env.DATABASE_URL, {

        useNewUrlParser: true,

    })

    .then(() => console.log("Database Connected Successfully ss"))

    .catch((err) => console.log(err));

    app.delete('/logout', (req, res) => {
        console.log('dddhdh')
        req.logout(function (err) {
            if (err) { return next(err); }
            myvar = false;
            res.redirect('/everygreen/login');
        });
    })
  
app.use('/customer', indexRouter);
app.use('/admin', adminRouter);
app.use('/', userauth);
app.use('/', userHomePage);
app.use('/admin', adminHomepage);
app.use('/admin', user_management);
app.use('/admin', user_management_cru);
app.use('/admin', user_management_edit);
app.use('/admin', category_management);
app.use('/admin', book_management);
app.use('/admin',customer_management);
app.use('/admin', review_management);
app.use('/admin', order_management);
app.use('/admin', register_customer_management);
app.use('/everygreen', frontRouter);
app.use('/everygreen', customer_register_Router);

// app.use('/books', bookRouter);
app.use(function (req, res) {
    res.status(404).render('error');
});
app.use(function (req, res) {
    res.status(500).render('error');
});





app.listen(port, () => {
    console.log(`Listning on the port at ${port}`);
});