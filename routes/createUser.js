const router = require('express').Router();
const savefun = require('./saveUserDatabase');
const { check, validationResult } = require('express-validator');
const User = require('../modal/User');
router.get('/create_user', (req, res) => {
    res.render('admin/user_management/create_user', {user:new User});
})

router.post('/create_user',[
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
 (req, res) => {

// Check for Errors
const validationErrors = validationResult(req);
let errors = [];
if(!validationErrors.isEmpty()) {
  Object.keys(validationErrors.mapped()).forEach(field => {
    errors.push(validationErrors.mapped()[field]['msg']);
  });
}
// require('../views/partials')
if(errors.length){
    console.log(errors)
    res.render('../views/partials/errorDisplay',{
      errorMessage: ' Could not create User ' + errors
    });
  }  else {
    savefun(req, res, '/admin/user_management', true);
  }
    // res.redirect('/admin/user_management');
})

module.exports = router;