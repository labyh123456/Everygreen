const router = require('express').Router();
const eBook = require('../../modal/book');
const Category = require('../../modal/Category');
const { check, validationResult } = require('express-validator');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
var auth =require('../auth2');
var isAdmin = auth.isAdmin;
const isNotAdmin = auth.isNotAdmin;
router.get('/book_management',  isAdmin,  async (req, res) => {
    try {

        const books = await eBook.find().sort({title:1}).populate('categoryid').exec()
        res.render('admin/book_management/book_management.ejs', { books: books });

    } catch (error) {
        console.log('error traversing Book ' + error);
    }

})

// create new book
router.get('/book_management/create_new_book', isAdmin,  async  (req, res) => {
    renderNewPage(res, new eBook(), 'create_book');
})




// create new book
router.post('/book_management/create_new_book',isAdmin, async (req, res) => {
// console.log(req.body);
try {
const new_book = new eBook({
    title:req.body.title,
    author:req.body.author,
    desc:req.body.describtion,
    isbn:req.body.isbn,
    price:req.body.price,
    publishdate:req.body.date,
    lastupdate:Date.now(),
    categoryid:req.body.cat
});
saveCover(new_book, req.body.image);

    await new_book.save();
    res.redirect('/admin/book_management');
// res.send('success'); 
} catch (error) {
    // console.log(error)
    renderNewPage(res, new eBook(), 'create_book', true);
}

})
// show view book
// router.get('/book_management/:id', async (req, res) => {
// // res.send('show' + req.params.id)    
// try {

//     const book = await eBook.findById(req.params.id).sort({title:1}).populate('categoryid').exec()
//     res.render('admin/book_management/show_book.ejs', { book: book });

// } catch (error) {
//     console.log('error traversing Book ' + error);
// }

// })






// update get route of book
router.get('/book_management/:id/edit', isAdmin,  async (req, res) => {
    let book
    try{
     book = await eBook.findById(req.params.id)
    renderEditPage(res, book, "edit_book");
    }catch(error){
        console.log(error);
        renderEditPage(res, book, "edit_book", true);
    }
})


router.put('/book_management/:id/edit', isAdmin,  async (req, res) => {
    // res.send(req.body)

    let book 

    try {
        
        book = await eBook.findById(req.params.id);
        book.title = req.body.title;
        book.author  = req.body.author;
      book.desc = req.body.describtion;
    book.isbn =  req.body.isbn;
    book.price = req.body.price;
      book.publishdate = new Date(req.body.date);
      book.lastupdate = Date.now();
       book.categoryid = req.body.cat

       if(req.body.image != null && req.body.image != ''){
        saveCover(book, req.body.image)
    }
    await book.save();
    res.redirect('/admin/book_management');
    // ....

    } catch (error) {
          renderEditPage(res, book, "edit_book" ,true)
        }
})

//delete book route
router.delete('/book_management/:id', isAdmin,  async  (req, res) => {
    let book
try {
    book = await eBook.findById(req.params.id)

    book.remove();
    res.redirect('/admin/book_management');
} catch (error) {
    const books = await eBook.find().populate('categoryid').sort({title:1}).exec()
    res.render('admin/book_management/book_management.ejs',
    { books:books, errorMessage: 'Error Deleting Books' });
}
})

// function to save images into database through filepond library
function saveCover(book, coverEncoded){
    if(coverEncoded == null)   return 
        const cover = JSON.parse(coverEncoded)

    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

// it will render new page
async function renderNewPage(res, book, form, hasError = false){
renderFormPage(res, book, form, hasError);
}

// it will edit new page
async function renderEditPage(res, book, form, hasError = false){
    renderFormPage(res, book, form, hasError);
    }


async function renderFormPage(res, book,form,hasError = false ) {
    try {
        
        const categories = await Category.find();
        const params =  {
            categories:categories,
            book:book
        }

        if(hasError){
            if(form == 'edit_book')
            params.errorMessage = "Error Updating Book"
            else
            params.errorMessage = "Error Creating New Book"
        }
        res.render(`admin/book_management/${form}`, params)

    } catch (error) {
        console.log(error)
    res.render('admin/book_management', {errorMessage:"Something Went Wrong"});        
    }
      
}

module.exports = router;