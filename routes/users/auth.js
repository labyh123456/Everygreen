// const { route } = require('../users');
const router = require('express').Router();
const User = require('../../modal/User');
const savefun = require('../saveUserDatabase');
const { check, validationResult } = require('express-validator');
const CryptoJS = require('crypto-js');
// const { findOne } = require('../../modal/book');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

//Register get Route
router.get('/register',  (req, res) => {
    console.log('come')
res.render('customer/auth');
});

//Reister Post Route
router.post('/register' , async (req, res) => {
// if((req.username == '' && req.username == null)){
//     res.render('customer/auth', {errorMessage:"Please Provide full info"});
// }
//     ((req.email === '' && req.email == null))  ||
//     ((req.password === '' && req.password == null))
// res.render('customer/auth', {errorMessage:"Please Provide full info"});
// else
  savefun(req, res, "/everygreen");
// try {
//     const newUser = new User({
//         username:req.body.username,
//         email:req.body.email,
//         password: CryptoJS.AES.encrypt(
//             req.body.password,
//             process.env.PASS_SEC
//           ).toString(),
//         });    
//         await newUser.save()
//         res.send('success')
// } catch (error) {

//     console.log('Errror saving User', error);
//     res.send(error);
// }
});

// Login Get Route
router.get('/user/login', (req, res) => {
res.render('customer/login');
})

// Login Post Route
router.post('/user/login', async (req, res) => {

if(req.body.email == ''){
    res.send('inValid Credentials');
}    

const user = await User.findOne({email:req.body.email});
if(user == null || user == ''){
    res.send('Invalid Email')
    // res.render('customer/login', {error:'Username not found'});
}
else{
const hashPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.PASS_SEC
);

const password = hashPassword.toString(CryptoJS.enc.Utf8);
console.log(password);
if(password != req.body.password)
res.send('password is not correct')
// res.render('customer/loin', {error: "PassWord is not Correct"});
else{
// const accessToken = jwt.sign({
//     id:user._id,
//     isAdmin:user.isAdmin
// }, process.env.JWT_SEC, {expiresIn:"3d"});
    
res.send('you are authenticated');
}
}
})
  

module.exports = router;