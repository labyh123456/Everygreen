const router = require('express').Router();
const CryptoJS = require('crypto-js');
const User  = require('../modal/User');
const bcrypt = require('bcrypt')
saveUserInDatabse =   async (req, res, strredirect, isAdmin = false) => {
    // res.send(req.body);
    // console.log('errror somewhere dude . . ');
try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password: hashedPassword,
          isAdmin:isAdmin
        });    
        await newUser.save()
        // res.send('success')
        res.redirect(strredirect);
} catch (error) {

    console.log('Errror saving User', error);
    res.send(error);
}

//     // console.log()
// }
}
module.exports = saveUserInDatabse;