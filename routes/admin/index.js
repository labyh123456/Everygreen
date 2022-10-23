const express = require('express');
const router  = express.Router();
const Book = require('../../modal/book')
const bookOrder = require('../../modal/bookOrder');
const orderDetail = require('../../modal/orderDetail');
const Review = require('../../modal/review');
const User = require('../../modal/User');
const Customer = require('../../modal/customer');
const passport = require('passport');
var auth =require('../auth2');
var isAdmin = auth.isAdmin;
const isNotAdmin = auth.isNotAdmin;
router.get('/', isAdmin,   async (req, res) => {
        try {

            // 3 Recent Orders Section
            const book_order  = await bookOrder.find().sort({orderdate:'desc'}).populate('customerid').limit(3).exec();
            
            // 3 Recent review Section             
            let rev =  await Review.find().populate('bookid customerid').sort({reviewtime:-1}).limit(3).exec();

            // Statistics section 
            const total_books = await Book.find();
            const total_users = await User.find({isAdmin:true});
            const total_customer = await Customer.find();
            const total_orders = await bookOrder.find();
            const total_review = await Review.find();
            const total_register_customer = await User.find({isAdmin:false});
            
            res.render('admin/index.ejs', {
                user:req.user,
                order:book_order,
                reviews:rev,
                total_users:total_users.length,
                total_books:total_books.length,
                total_customers:total_customer.length,
                total_orders:total_orders.length,
                total_reviews:total_review.length,
                total_register_customer:total_register_customer.length
            })
        } catch (error) {
            console.log(error);
          res.redirect('/');  
        }        
})

router.get('/hhhhh', async (req, res) => {
    // res.send('hello dear');
    try {
        let rev =  await Review.find().populate('bookid customerid').sort({reviewtime:-1}).exec();
        res.render('admin/index.ejs', {
          reviews:rev  
        });    
    } catch (error) {
        // console.log(error)
        res.redirect('/admin');
    }
    // require('../../views/admin')
 })


 router.get('/login', isNotAdmin,  (req, res) => {
    res.render('partials/login2', {url:'/admin/login'});
 })
 router.post('/login', passport.authenticate('local', {
    failureRedirect: '/admin/login',
    failureFlash: true,
}), async (req, res) => {
    myvar = true
    res.redirect('/admin');
});

// function checkAuthenticated(req, res, next) {
//     if (req.isAuthenticated() && req.user.isAdmin == true){
//             return next()
// }
//     res.redirect('/admin/login')
// }

// function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated() && req.user.isAdmin == true) {
//         return res.redirect('/admin')
//     }
//     next()
// }
router.delete('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        myvar = false;
        res.redirect('/admin/login');
    });
})

module.exports = router;