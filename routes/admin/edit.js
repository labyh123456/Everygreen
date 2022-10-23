const User = require('../../modal/User');
const CryptoJS = require('crypto-js');
const router = require('express').Router();
const { check, validationResult } = require('express-validator');
var auth =require('../auth2');
var isAdmin = auth.isAdmin;
const isNotAdmin = auth.isNotAdmin;
// require('../../views/admin/user_management/')
router.get('/:id/edit',  async (req, res) => {
    console.log('hello');
    let user
    try {
        user = await User.findById(req.params.id);
        const hashPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );
        const password = hashPassword.toString(CryptoJS.enc.Utf8);

        user.password = password;
        console.log(user);
        res.render('admin/user_management/edit.ejs', { user: user });
    } catch (error) {
        if (user == null)
            res.redirect('/');
        else {
            res.render('admin/user_management/edit',
                { errorMessage: "Error Updating User" });
        }
        console.log(error);
    }

})

//old
router.post('/edit', (req, res) => {
    console.log(req.body);
    // savefun(req, res, '/admin/user_management');
})
//new update
router.put('/:id',[
check('username').not().isEmpty().withMessage('UserName is Required')
.custom((value, {req})=>{
    return new Promise((resolve, reject)=> {
        User.findOne({username:req.body.username}, function(err, user){
            if(err){
                reject(new Error('Server error'))
            }
            if(Boolean(user)){
                reject(new Error('Username Already in Use'))
            }
            resolve(true)
        });
    });
}),
check('email').not().isEmpty().withMessage('Email is Required').isEmail().withMessage('Invalid Email')
.custom((value, {req})=>{
    return new Promise((resolve, reject)=> {
        User.findOne({email:req.body.email}, function(err, user){
            if(err){
                reject(new Error('Server error'))
            }
            if(Boolean(user)){
                reject(new Error('E-mail Already in Use'))
            }
            resolve(true)
        });
    });
}),
check('password')
.not()
.isEmpty()
.withMessage('Password is required'),
], 




    async (req, res) => {
    // savefun(req, res, '/admin/user_management');
    let user
    try {
        user = await User.findById(req.params.id);
        user.username = req.body.username,
            user.email = req.body.email,
            user.password = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.PASS_SEC
            ).toString();

        await user.save();
        res.redirect('/admin/user_management');
    }
    catch (error) {
        if (user == null)
            res.redirect('/admin/user_management');
        else {
            res.render('admin/user_management/edit.ejs',
                { user: user, errorMessage: 'Error Updating User: Make Sure Provide Unique Details' });
        }
        console.log(error);
    }

});

router.delete('/:id', async (req, res) => {
    // res.send('Delete User' + req.params.id);
    let user
    try {
        user = await User.findById(req.params.id);
        await user.remove();
        res.redirect('/admin/user_management');
    }
    catch (error) {
        console.log(error);
        res.render('admin/user_management/user_management.ejs',
            { errorMessage: 'Error Deleting User' });
    }


})

module.exports = router;