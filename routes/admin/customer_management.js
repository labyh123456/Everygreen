const router = require('express').Router();
const customer = require('../../modal/customer');
const Book = require('../../modal/User');
const bcrypt = require('bcrypt')
var auth =require('../auth2');
var isAdmin = auth.isAdmin;
const isNotAdmin = auth.isNotAdmin;
router.get('/customer_management', async (req, res) => {

    try {
        const new_customer = await customer.find().sort({ username: 1 });
        // console.log(new_customer);
        res.render('admin/customer_management/customer_management', { customers: new_customer });

    } catch (error) {
        console.log('error traversing users ' + error);
    }

})

// create customer get route
router.get('/customer_management/create_customer', (req, res) => {
    renderNewPage(res, new customer(), 'create_customer');
})

// create customer post route
router.post('/customer_management/create_customer', async (req, res) => {
    // res.send(req.body);
    // const hashedPassword = await bcrypt.hash(req.body.password, 10)
    try {
        const new_customer = new customer({
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
        res.redirect('/admin/customer_management');
    } catch (error) {
        console.log(error)
        renderNewPage(res, new customer(), 'create_customer', true);
    }
})
// update get route
router.get('/customer_management/:id/edit', async (req, res) => {
    try {
        const ncustomer = await customer.findById(req.params.id);
        renderEditPage(res, ncustomer, 'edit_customer');
    } catch (error) {
        renderNewPage(res, new customer(), 'create_customer', true);
    }
})

// update post route
router.put('/customer_management/:id', async (req, res) => {
    let ncustomer
    try {
        ncustomer = await customer.findById(req.params.id);
        ncustomer.email = req.body.email
        ncustomer.fullname = req.body.fullname
        ncustomer.address = req.body.address
        ncustomer.city = req.body.city
        ncustomer.country = req.body.country
        ncustomer.phonenumber = req.body.phonenumber
        ncustomer.zipcode = req.body.zipcode
        ncustomer.password = req.body.password

        await ncustomer.save();
        res.redirect('/admin/customer_management');

    } catch (error) {
        console.log(error)
        renderEditPage(res, ncustomer, 'edit_customer', true);
    }
})

// delete customer route
router.delete('/customer_management/:id', async (req, res) => {
    let ncustomer 
    try {
        ncustomer = await customer.findById(req.params.id)
        ncustomer.remove();
        res.redirect('/admin/customer_management');
    } catch (error) {
        res.render('admin/customer_management/customer_management', 
        { customers: ncustomer,
            errorMessage:'Failed to Delete Customer'
         });
    }

})


// it will render new page
async function renderNewPage(res, ncustomer, form, hasError = false) {
    renderFormPage(res, ncustomer, form, hasError);
}

async function renderEditPage(res, ncustomer, form, hasError = false) {
    renderFormPage(res, ncustomer, form, hasError);
}

async function renderFormPage(res, ncustomer, form, hasError = false) {
    try {
        // const new_customer = await customer.find().sort({registerdate:1});
        const params = {
            customer:ncustomer
        }

        if(hasError){
            if(form == 'edit_customer')
            params.errorMessage = "Error Updating Book";
            else
            params.errorMessage = "Error Creating Book";
        }
        res.render(`admin/customer_management/${form}`, params);
    } catch (error) {
        res.render('admin/customer_management', { errorMessage: "Something Went Wrong" });
    }
}


module.exports = router;