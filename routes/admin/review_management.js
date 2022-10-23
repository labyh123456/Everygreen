const review = require('../../modal/review');

const router = require('express').Router();
var auth =require('../auth2');
var isAdmin = auth.isAdmin;
const isNotAdmin = auth.isNotAdmin;
 router.get('/review_management', async (req, res) => {
    // res.send('hello dear');
    try {
        let rev =  await review.find().populate('bookid customerid').sort({reviewtime:-1}).exec();
        res.render('admin/review_management/review_management', {
          reviews:rev  
        });    
    } catch (error) {
        // console.log(error)
        res.redirect('/admin');
    }
    // require('../../views/admin')
 })

 // update The review get route
 router.get('/review_management/:id/edit', async (req, res) => {
    let edit_review 
    try {
        edit_review  = await review.findById(req.params.id).populate('bookid customerid').exec();
        res.render('admin/review_management/edit_review', {
            review:edit_review
        })
    } catch (error) {
        res.redirect('/admin/review_management');
    }  
    // res.send('djdj');
 })

 // update The review post route

 router.put('/review_management/:id', async (req, res) => {
    let edit_review 
    try {
        edit_review = await review.findById(req.params.id);
        edit_review.headline = req.body.headline;
        edit_review.comment = req.body.comment

       await edit_review.save();
       res.redirect('/admin/review_management');
    } catch (error) {
        // console.log(error)
        res.render('admin/review_management/review_management', {
            errorMessage:"Error Editing Review" 
        });
    }
 })

 // delete review post + get route
 router.delete('/review_management/:id', async (req, res) => {
    let rev 
    try {
        rev = await review.findById(req.params.id);
        rev.remove();
        res.redirect('/admin/review_management');
    } catch (error) {
        console.log(error);
        const books = await review.find().populate('bookid customerid').exec();
        res.render('admin/review_management/review_management.ejs',
        { books:books, errorMessage: 'Error Deleting Review' });
    }
 })

module.exports = router;