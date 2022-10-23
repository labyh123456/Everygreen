const router = require('express').Router();
const User = require('../../modal/User');
const Book = require('../../modal/User');
const bcrypt = require('bcrypt')
var auth =require('../auth2');
    var isAdmin = auth.isAdmin;
    const isNotAdmin = auth.isNotAdmin;
router.get('/user_management', async (req, res) => {
try {
    
    const user = await User.find({isAdmin:true}).sort({username:1});
    console.log(user);
    res.render('admin/user_management/user_management', {users:user});
    
} catch (error) {
    console.log('error traversing users ' + error);
}

})

router.get('/user_management_create_user', (req, res) => {
        // res.render('customer/customer_register.ejs', { customer: new customer() });
        res.render('admin/user_management/register_user');
})

router.post('/user_management_create_user', async (req, res) => {

    try {
    
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const new_user = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword,
        isAdmin:true
        })

        await new_user.save();
        res.redirect('/admin/user_management');
    } catch (error) {
        console.log(error)
        res.render('customer/customer_register.ejs', {
            customer: new customer(),
            errorMessage: 'Registration Failed'
        });
    }
});


router.get('/user_management/edit_user/:id', async (req, res) => {
    let nuser
    try {
         nuser = await User.findById(req.params.id);
         res.render('admin/user_management/edit_user.ejs', {user:nuser});
    } 
    catch (error) {
     res.redirect('/admin/user_management');
    }
})

router.put('/user_management/:id', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let nuser 
    try {

        nuser = await User.findById(req.params.id);
        nuser.username = req.body.username
        nuser.email = req.body.email
        nuser.password = hashedPassword

       await nuser.save();
       res.redirect('/admin/user_management');
    } catch (error) {
        res.render('admin/user_management/edit_user.ejs', {user:new User, errorMessage:'Failed to Edit user'});
    }
});

router.delete('/user_management/delete_user/:id', async (req, res) => {
   let nuser 
    try {
        nuser = await User.findById(req.params.id);
        nuser.remove();
        res.redirect('/admin/user_management');
    } catch (error) {
        res.redirect('/admin/user_management');
    }
})
module.exports = router;