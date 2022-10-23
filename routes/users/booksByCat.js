const Category = require('../../modal/Category');
const eBook = require('../../modal/book');
const router = require('express').Router();

router.get('/booksByCategory/:id',async  (req, res) => {
    try{
    const categories = await Category.find();    
    const category = await Category.findById(req.params.id);    
    const books = await eBook.find({categoryid:category.id})
    // console.log(books)
    res.render('customer/bookByCat.ejs', {
        categories:categories,
      category:category,
        books:books
    })
}catch(error)
{
    console.log(error)
}
    // res.send('show cat id ' + req.params.id);
})



module.exports = router;