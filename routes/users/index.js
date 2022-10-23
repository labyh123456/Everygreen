const Category = require('../../modal/Category');
const eBook = require('../../modal/book');
const router = require('express').Router();


// router.get('/everygreen', async (req, res) => {
//     try {
//         const categories = await Category.find().sort({ name: 1 })
//         const books = await eBook.find().sort({ publishdate: -1 }).limit(4).exec()
//         console.log(req.user);
//         res.render('customer/index', {
//             categories: categories,
//             books: books,
//             customer:req.user
//         });
//     } catch (error) {
//         console.log(error)
//     }
// })




router.get('/everygreen/search_books', async (req, res) => {
    let searchOption = {}

    if (req.query.title != null && req.query.title != '') {
        searchOption.title = new RegExp(req.query.title, 'i');

        eBook.find( { $or:[ {'title':searchOption.title}, {'author':searchOption.title}, {'desc':searchOption.title} ]}, 
        function(err,docs){
            if(!err)
            res.render('customer/search_books.ejs', { books: docs, searchOption: req.query })
             else
             console.log(err)      
      });
        // res.send(req.query);
        // const books = await eBook.find(searchOption);
       
}else{

    try {
    const books =  await eBook.find();
        res.render('customer/search_books.ejs', { books: books, searchOption: req.query })
    } catch (error) {
    res.redirect('/everygreen')        
    }
}
})


module.exports = router;