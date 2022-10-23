const router = require('express').Router();
const Category = require('../../modal/Category');
const { check, validationResult } = require('express-validator');
var auth =require('../auth2');
var isAdmin = auth.isAdmin;
const isNotAdmin = auth.isNotAdmin;
router.get('/category_management', async (req, res) => {

    try {

        const categories = await Category.find().sort({ name: 1 });
        // console.log(categories);
        res.render('admin/category_management/category_management.ejs', { categories: categories });

    } catch (error) {
        console.log('error traversing Categories ' + error);
    }

})


// create User
router.get('/create_category', (req, res) => {
    res.render('admin/category_management/create_category');
})

router.post('/create_category', async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name
        })
        await category.save();
        res.redirect('/admin/category_management');
    }
    catch (error) {
        console.log('error ', error);
        res.render('admin/category_management/create_category', { errorMessage: 'Failed to Create Category' });
    }
})

router.get('/category_management/:id/edit', async (req, res) => {
    // res.send('send' + req.params.id)    
    try {
        const category = await Category.findById(req.params.id);
        res.render('admin/category_management/edit.ejs', { category: category });
    } catch (error) {
        console.lo(error)
        res.redirect('/admin/category_management');

    }
})

// Update category
router.put('/category_management/:id/edit', [
    check('name').not().isEmpty().withMessage('Name is Required')
.custom((value, {req})=>{
    return new Promise((resolve, reject)=> {
        Category.findOne({name:req.body.name}, function(err, user){
            if(err){
                reject(new Error('Server error'))
            }
            if(Boolean(user)){
                reject(new Error('Category name Already in Use'))
            }
            resolve(true)
        });
    });
})
],
async (req, res) => {
    // const validationErrors = validationResult(req);
    // let errors = [];
    // if(!validationErrors.isEmpty()) {
    //   Object.keys(validationErrors.mapped()).forEach(field => {
    //     errors.push(validationErrors.mapped()[field]['msg']);
    //   });
    // }
    // // require('../views/partials')
    // if(errors.length){
    //     console.log(errors)
    //     res.render('admin/category_management/edit.ejs', { category: new Category(), errorMessage: 'Failed to Update Category'});
    //   }
    //   else{

    console.log('here ', req.body);
    let category
    try {
    category   = await Category.findById(req.params.id);
        category.name = req.body.name

       await category.save();
        res.redirect('/admin/category_management');
    } catch (error) {
        console.log(error);
        res.render('admin/category_management/edit.ejs', { category: category, errorMessage: 'Failed to Update Category' });
    }
})

// delete a category
router.delete('/category/:id', async (req, res) => {
    // res.send('Delete User' + req.params.id);
    let category
    try {
        category = await Category.findById(req.params.id);
        await category.remove();
        res.redirect('/admin/category_management');
    }
    catch (error) {
        const categories = await Category.find().sort({ name: 1 });
        // console.log(categories);
        res.render('admin/category_management/category_management.ejs', { categories: categories,  errorMessage: 'Error Deleting Categories'});
        // res.render('admin/category_management/category_management.ejs',
        //     { errorMessage: 'Error Deleting Categories' });
    }


})
module.exports = router;