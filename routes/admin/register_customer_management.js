const User = require('../../modal/User');

const router = require('express').Router();
router.get('/register_customer_management', async (req, res) => {
    try {
        
        const user = await User.find({isAdmin:false}).sort({username:1});
        res.render('admin/register_customer_management/register_customer.ejs', {users:user});
        
    } catch (error) {
        console.log('error traversing users ' + error);
    }
});

router.delete('/register_customer_management/delete/:id', async (req, res) => {
   let nuser 
    try {
        nuser = await User.findById(req.params.id);
        nuser.remove();
        res.redirect('/admin/register_customer_management');
    } catch (error) {
    res.redirect('/admin/register_customer_management');
    }
})
module.exports = router;