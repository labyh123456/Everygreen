const customer = require('../../modal/customer');
const CryptoJS = require('crypto-js');
const router = require('express').Router();
const Category = require('../../modal/Category')
const passport = require('passport');

const session = require('express-session');
const bcrypt = require('bcrypt')
const eBook = require('../../modal/book');
const review = require('../../modal/review');
const cal_review = require('./Calculate_Reviews');
const MongoStore = require('connect-mongo');
const bookOrder = require('../../modal/bookOrder');
const orderDetail = require('../../modal/orderDetail');
const User = require('../../modal/User');
var auth = require('../auth2');
var isuser = auth.isUser;
const isNotUser = auth.isNotUser;

// cart get route
router.get('/cart/:id', async (req, res) => {
    try {
        const nbook = await eBook.findById(req.params.id);
        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: nbook.title,
                book_author: nbook.author,
                book_id: nbook.id,
                qty: 1,
                price: parseFloat(nbook.price).toFixed(2),
                image: nbook.coverImagePath
            });
        }
        else {
            const cart = req.session.cart;
            var newItem = true;

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].title == nbook.title) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                cart.push({
                    title: nbook.title,
                    book_author: nbook.author,
                    book_id: nbook.id,
                    qty: 1,
                    price: parseFloat(nbook.price).toFixed(2),
                    image: nbook.coverImagePath
                });
            }
        }
        res.redirect('back');
    } catch (error) {
        console.log(error);
        res.redirect('back')
    }
})


// cart update get route 
router.get("/cart/update/:title", (req, res) => {
    const title = req.params.title;
    const cart = req.session.cart;
    const action = req.query.action;

    cart.forEach(carts => {
        if (carts.title == title) {
            switch (action) {
                case "add": carts.qty++; break;
                case "subtract": carts.qty--;
                    if (carts.qty < 1)
                        cart.splice(carts, 1);
                    break;
                case "clear":
                    cart.splice(carts, 1);
                    if (carts.length == 0) delete req.session.cart;
                    break;
                default: console.log('Update Problem'); break;

            }
        }

    });
    res.redirect('/everygreen/Mycart');
})
// --------------------------------------------------------


// cart post route
router.get('/Mycart', isuser, (req, res) => {
    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/everygreen/Mycart');
    }
    else {
        res.render("customer/cart.ejs", { books: req.session.cart });
    }
})



//clear cart route
router.get('/ClearCart', (req, res) => {
    delete req.session.cart;
    res.redirect('/everygreen/Mycart');
})
// ------------------------------------------------------


//checkout get route
router.get('/checkout', async (req, res) => {
    let ncustomer
    let category
    ncustomer = await customer.findOne({ userid: req.user._id })
    category = await Category.find().sort({ name: 1 })
    if (!ncustomer) {
        res.render('customer/message_for_user.ejs');
    }
    else {
        try {
            const user_profile = await customer.findOne({ email: req.user.email });   
            res.render("customer/checkout.ejs", {
                categories:category,
                books: req.session.cart,
                user: user_profile,
            });
        } catch (error) {
            res.redirect('/everygreen/Mycart');
        }
    }
})
// ----------------------------------------------------------------


// place order post route
router.post('/placeOrder', async (req, res) => {
    let temp
    try {
        temp = await customer.findOne({ userid: req.user.id });
        const book_order = new bookOrder({
            customerid: req.body.customerid,
            recname: req.body.rname,
            recphone: req.body.rnumber,
            orderqty: req.body.total_copies,
            paymentmethod: req.body.paymentmethod,
            ordertotal: req.body.total_price,
            shippingaddress: req.body.raddress + ' ' + req.body.rcity + ' ' + req.body.rzipcode,
            orderdate: Date.now()
        });

        let order_detail = new orderDetail({
            orderid: book_order.id,
            userid: temp._id,
            cart: req.session.cart
        })
        await order_detail.save();
        await book_order.save();
        res.render('customer/success_order.ejs');
    } catch (error) {
        console.log(error);
    }
})
// ------------------------------------------------------------------

//order history get route
router.get('/myorders', async (req, res) => {

    let temp = await customer.findOne({ userid: req.user.id });
    const user = await bookOrder.find({ customerid: temp }).sort({ orderdate: 'desc' }).exec();

    res.render('customer/order_history', {
        order: user
    })
})

// order details get route
router.get('/order/:id/detail', async (req, res) => {
    let temp = await customer.findOne({ userid: req.user.id });
    const book_detail = await orderDetail.findOne({ orderid: req.params.id })
    const book_order = await bookOrder.findById(req.params.id);
    console.log(temp._id, 'fff', book_order.customerid);
    if ((temp._id.toHexString()) == (book_order.customerid).toHexString()) {

        res.render("customer/order_details", {
            books: book_detail.cart,
            orders: book_order,
            id: req.params.id
        })
    }
    else
        res.render('partials/security_message.ejs');
})
// ----------------------------------------------------------------------

// home page get route
router.get('/',  async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 })
        const books = await eBook.find().sort({ publishdate: -1 }).limit(4).exec()

        // most selling books functionality
        let c = await orderDetail.aggregate([
            {
                $unwind: "$cart"
            },
            {
                $group: {
                    "_id": "$cart.book_id",
                    "qty": {
                        $sum: "$cart.qty"
                    }
                }
            }
        ]).sort({ qty: -1 }).limit(4);
        // extra care 
        if (c.length == 0) {
            c = books
        }
        let ids = [
            `${c[0]._id}`,
            `${c[1]._id}`,
            `${c[2]._id}`,
            `${c[3]._id}`
        ];


        const unorderedUsers2 = await eBook.find({ _id: { $in: ids } })
        let obj2 = {}
        unorderedUsers2.forEach(x => obj2[x._id] = x)
        const ordered2 = ids.map(ids => obj2[ids])

        // most favourite books functionality
        let c2 = await review.aggregate([
            {
                $group: {
                    "_id": "$bookid",
                    sum: { $sum: 1 },
                    total: { $avg: "$rating" }
                }
            },
            { $match: { total: { $gt: 1 } } },
            { $sort: { sum: -1, total: -1 } }
        ])

        // extra care

        if (c2.length == 0) {
            c2 = books
        }
        let ids2 = [
            c2[0]._id,
            c2[1]._id,
            c2[2]._id,
            c2[3]._id
        ];

        const unorderedUsers = await eBook.find({ _id: { $in: ids2 } })
        let obj = {}
        unorderedUsers.forEach(x => obj[x._id] = x)
        const ordered = ids2.map(ids => obj[ids])
       
        res.render('customer/index', {
            categories: categories,
            books: books,
            selling_books: ordered2,
            favourite_books: ordered,
            customer: req.user,
            cal_review: cal_review
        });
    } catch (error) {
        console.log('somewhere', error)

    }
})
// ------------------------------------------------------------


// customer registeration get route
router.get('/register', (req, res) => {
    res.render('customer/register.ejs');
})
// -----------------------------------------------


// customer registeration post route
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const new_user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        await new_user.save();
        res.redirect('/');
    } catch (error) {
        console.log(error)
        res.render('customer/customer_register.ejs', {
            customer: new customer(),
            errorMessage: 'Registration Failed'
        });
    }
});


//customer login get route
router.get('/login', isNotUser, (req, res) => {
    res.render('partials/login2', { url: '/everygreen/login' });
})
// -------------------------------------------


//customer login post route
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/everygreen/login',
    failureFlash: true,
}), async (req, res) => {
    myvar = true;
    if (req.user.isAdmin == false) {
        res.redirect('/everygreen');
    }
    else {
        req.logout(function (err) {
            if (err) { return next(err); }
            myvar = false;
            res.redirect('/everygreen/login');
        });
    }
}
);
// ---------------------------------------

// show single book get route
router.get('/show_book/:id', async (req, res) => {    
    try {

        const book = await eBook.findById(req.params.id).sort({ title: 1 }).populate('categoryid').exec();
        const review_for_book = await review.find({ bookid: book.id }).sort({ reviewtime: 'desc' }).populate('customerid').exec();
    
        res.render('customer/show_book.ejs', {
            book: book,
            reviews: review_for_book
        });

    } catch (error) {
        console.log('error traversing Book ' + error);
    }

})
//--------------------------------------------------


// Customer Profile get route

router.get('/customer_profile', async (req, res) => {
    let categories
    let ncustomer
    try {
        categories = await Category.find().sort({ name: 1 })
        ncustomer = await customer.findOne({ userid: req.user._id })
    } catch {
        res.redirect('/everygreen/login');
    }

    res.render('customer/customer_profile', {
        categories: categories,
        customer_info: ncustomer,
        customer: req.user
    })
});
//-----------------------------------------------------------

// customer profile get route
router.get('/complete_customer_profile/:id', (req, res) => {
    renderNewPage(res, new customer(), 'complete_customer_profile', req.params.id);
})

// complete customer profile post route
router.post('/complete_customer_profile', async (req, res) => {
    try {
        const new_customer = new customer({
            userid: req.body.id,
            email: req.body.email,
            fullname: req.body.fullname,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            phonenumber: req.body.phonenumber,
            zipcode: req.body.zipcode,
            registerdate: Date.now()
        })
        await new_customer.save();
        res.redirect('/everygreen/customer_profile');
    } catch (error) {
        console.log(error)
        renderNewPage(res, new customer(), 'complete_customer_profile', true);
    }
})
// ---------------------------------------------------------------


// Edit Customer Profile get route
router.get('/customer_profile/:id/edit', async (req, res) => {    
    let categories
    let ncustomer
    try {
        categories = await Category.find().sort({ name: 1 })
        ncustomer = await customer.findOne({ userid: req.params.id });
        // needs to be bcrypt password
        res.render('customer/customer_profile_edit', {
            categories: categories,
            customer: ncustomer,
            yes: true
        })
    } catch (error) {
        console.lo(error)
        res.redirect('/admin/category_management');

    }
})
// -------------------------------------------------------------

// update customer profile put route
router.put('/customer_profile/:id', async (req, res) => {
    let ncustomer
    try {
        ncustomer = await customer.findOne({ userid: req.params.id });
        ncustomer.email = req.body.email
        ncustomer.fullname = req.body.fullname
        ncustomer.address = req.body.address
        ncustomer.city = req.body.city
        ncustomer.country = req.body.country
        ncustomer.phonenumber = req.body.phonenumber
        ncustomer.zipcode = req.body.zipcode

        await ncustomer.save();
        res.redirect('/everygreen/customer_profile');

    } catch (error) {
        console.log(error);
        res.render('customer/customer_profile_edit', {
            categories: new Category,
            customer: ncustomer,
            errorMessage: "Failed To Update Profile"
        })
    }

});
// -----------------------------------------------------------------

// review get route
router.get('/write_review/:id', async (req, res) => {
    if (myvar) {
        let flag = false;
        let temp = await customer.findOne({ userid: req.user.id });
        let check = await orderDetail.find({ userid: temp._id });
        
        check.forEach(record => {
            if (record.cart.filter(x => x.book_id === req.params.id).length > 0) {
                flag = true;
            }
        });

        if (flag == true) {
            let ncustomer
            ncustomer = await customer.findOne({ userid: req.user._id })
            if (!ncustomer) {
                res.render('customer/message_for_user.ejs');
            }
            else {
                let temp = await customer.findOne({ userid: req.user.id });
                const book = await eBook.findById(req.params.id);
                let t = 0;
                const new_user_review = await review.find({ bookid: book.id });
                if (new_user_review.length < 1) {
                    res.render('customer/write_review.ejs', {
                        book: book,
                        customer: temp.email
                    })
                }

                else {
                    new_user_review.forEach(review => {
                        if (review.customerid.toHexString() === temp._id.toHexString()) {
                            res.render('customer/already_reviewed.ejs', {
                                book: book,
                                customer: temp.email,
                                review: review
                            });
                        }
                        else {
                            res.render('customer/write_review.ejs', {
                                book: book,
                                customer: temp.email
                            })
                        }
                    })
                }
            }
        }
        else {
            res.send('you need to buy this book before review');
        }

    }
    else
        res.redirect('/everygreen/login');
});
// ----------------------------------------------------------------------------

// submit review post route 
router.post('/submit_review', async (req, res) => {
    let temp = await customer.findOne({ userid: req.user.id });
    try {
        let rev = new review({
            bookid: req.body.bookid,
            customerid: temp._id,
            rating: req.body.rating,
            headline: req.body.headline,
            comment: req.body.comment,
            reviewtime: Date.now()
        });
        let doc = await eBook.findOne({ _id: req.body.bookid });
        doc.bookrating.push(req.body.rating);
        await doc.save();
        await rev.save();
        console.log(doc.bookrating);

        res.redirect('show_book/' + req.body.bookid);
    } catch (error) {
        console.log(error)
        res.redirect('/everygreen');
    }
})
// --------------------------------------------------------


// function to render new page
async function renderNewPage(res, ncustomer, form, id, hasError = false) {
    renderFormPage(res, ncustomer, form, id, hasError);
}

// function to render edit page
async function renderEditPage(res, ncustomer, form, hasError = false) {
    renderFormPage(res, ncustomer, form, hasError);
}

// it will render both edit and new
async function renderFormPage(res, ncustomer, form, id = null, hasError = false) {
    try {
        const params = {
            customer: ncustomer
        }

        if (hasError) {
            if (form == 'edit_customer')
                params.errorMessage = "Error Updating Book";
            else
                params.errorMessage = "Error Creating Book";
        }
        if (id) {
            params.id = id;
        }

        res.render(`customer/${form}`, params);
    } catch (error) {
        res.render('admin/customer_management', { errorMessage: "Something Went Wrong" });
    }
}

module.exports = router;