const bookOrder = require('../../modal/bookOrder');
const eBook = require('../../modal/book');
const orderDetail = require('../../modal/orderDetail');
const review = require('../../modal/review');
const mongoose = require('mongoose');

const router = require('express').Router();
var auth =require('../auth2');
var isAdmin = auth.isAdmin;
const isNotAdmin = auth.isNotAdmin;
router.get('/order_management', async (req, res) => {
try {
    // console.log(req.session.cart);
    const book_order  = await bookOrder.find().sort({orderdate:'desc'})  .populate('customerid').exec();
    const order_detail =  await orderDetail.find();
    
    res.render('admin/order_management/order_management.ejs', {
        order:book_order
    })
} catch (error) {
    console.log(error);
  res.redirect('/');  
}
})


router.get('/order_management/:id/detail', async (req, res)=> {
const book_detail = await orderDetail.findOne({orderid:req.params.id})

const book_order  = await bookOrder.findById(req.params.id);

res.render("admin/order_management/order_detail", {
  books:book_detail.cart,
  order_id:book_detail.orderid,
  orders:book_order,
  id:req.params.id 
})
// res.send(book_detail);
});


router.get('/order_management/add_book/:id', async (req, res) => {
  // res.send('come');
  // try{
  //   await orderDetail.updateOne(
  //    {orderid:req.params.id},
  //    {
  //      $push:{
  //        cart:{
  //          $each:[
  //            {
  //              title:'hel',
  //              price:3
  //            }
  //          ]
  //        }
  //      }
  //    }
  //  )
  //  }
  //  catch(err){
     
  //  }
  
  try {

    const books = await eBook.find().sort({title:1}).populate('categoryid').exec()
    res.render('/admin/order_management/add_book.ejs', { books: books,
    order_id:req.params.id});

} catch (error) {
    console.log('error traversing Book ' + error);
}
})


router.get('/add_book/:order_id/:id', async (req, res) => {
  // res.send(req.params.order_id);
  try{
  const nbook = await eBook.findById(req.params.id); 
  
     await orderDetail.updateOne(
     {orderid:req.params.order_id},
     {
       $push:{
         cart:{
           $each:[
             {
              title:nbook.title,
              book_author:nbook.author,
              book_id:nbook.id,
              qty:1,
              price:parseFloat(nbook.price).toFixed(2),
              image:nbook.coverImagePath 
             }
           ]
         }
       }
     }
   )

     let va = `/admin/order_management/edit_order/${req.params.order_id}`;
  res.redirect(va);
  }catch(error){
    console.log('error', error);
  }
})

// update qty
router.post('/order_management/bookid/:id', async (req, res) => {
try{
 await bookOrder.updateOne({_id:req.params.id},
    {
      $set:{
        orderqty:req.body.total_copies,
        ordertotal:req.body.total_price
      }
    })
    res.redirect('/admin/order_management');
}
catch(error){
  res.redirect('/');
} 
})
router.put('/order_info/:id/edit_order', async (req, res) => {
try {
  // res.send(req.body);  
  const book_order = await bookOrder.findById(req.params.id);
  book_order.recname = req.body.name;
  book_order.recphone = req.body.phone;
  book_order.shippingaddress = req.body.address;
  book_order.paymentmethod = req.body.paymentmethod;
  book_order.orderstatus = req.body.status;

  await book_order.save();
 res.redirect('back');
} catch (error) {
  console.log(error)
}





})




router.post('/order_management/:id/:title/:qty', async (req, res) => {
const  action = req.query.action;
console.log(req.params.title);
if(action == "delete"){
try{
await orderDetail.updateOne({orderid:req.params.id},
{
  $pull:{
    cart:{title:req.params.title} 
  }
}
)
}
catch(error){
  console.log('error deleteing', error);
  res.redirect('/');
}
}
else{
try{
await  orderDetail.updateOne( {'orderid':req.params.id,'cart.title': req.params.title}, {'$set': {
  'cart.$.qty': action == "add" ? parseInt(req.params.qty) +1 : parseInt(req.params.qty) - 1 
}}
);
}
catch(error){
  console.log(error);
}
}

res.redirect('back');
});




router.get("/order_management/edit_order/:id", async (req, res) => {
  const book_detail = await orderDetail.findOne({orderid:req.params.id})
const book_order  = await bookOrder.findById(req.params.id);
res.render("admin/order_management/edit_order", {
  books:book_detail.cart,
  order_id:book_detail.orderid,
  orders:book_order,
  id:req.params.id 
})
  // res.render('admin/order_management/edit_order.ejs')
})

// router.put('/order_management/:id/:title', async (req, res) => {

//   try {
   
//     let book_detail = await orderDetail.findOne({orderid:req.params.id})
// let book_order  = await bookOrder.findById(req.params.id);

// let action  = req.params.title;
// console.log('title', action);
// // book_detail.cart[0].qty = 79;


// // orderDetail.updateOne( {'orderid':req.params.id,'cart.title': req.params.title}, {'$set': {
// //   'cart.$.qty': 5
// // }}, function(err) { 
// //   console.log(err);
// // }
// // );
// // book_detail.cart.forEach(carts => {
// // if(carts.title == action){
// //   console.log('come')
// //   carts.qty  = 90;
// // }
// // });
// // await book_detail.save();
// // res.send(book_detail)
// //   } catch (error) {
// //     console.log(error)
// //   }
// }
// catch(erro){

// }
// });


router.delete("/orders_management/:id", async (req, res) => {
  try {
  const delete_order =  await bookOrder.findById(req.params.id);
  const delete_order_detail = await orderDetail.findOne({orderid:req.params.id});
  delete_order.remove();
  delete_order_detail.remove();
    // await bookOrder.deleteOne({_id:req.params.id});
    res.redirect('/admin/order_management');
  } catch (error) {
    console.log(error)
  }
})

router.get('/order_management/temp', async (req, res) =>{
  try {
    let c2=  await review.aggregate([  
      {
            $group:{ "_id": "$bookid", 
              sum:{$sum:1},
              total: {$avg:"$rating"}
            }},
             { $match: { total: { $gt: 1 } } },
              { $sort : { sum : -1, total: -1 } }
        ])
        // res.send(c2); 
        let ids2 = [
          c2[0]._id,
           c2[1]._id,
          c2[2]._id,
          c2[3]._id
        ];
    m = { "$match" : { "_id" : { "$in" : ids2 } } };
    a = { "$addFields" : { "__order" : { "$indexOfArray" : [ ids2, "$_id" ] } } };
    s = { "$sort" : { "__order" : 1 } };
  const f2  = await eBook.aggregate( [ m, a, s]);
  res.send(f2);

  }
  catch(error){
    console.log(error)
  }
})


router.post("/edit/", async (req, res) => {
  // res.send(req.params.title + req.session.cart + req.query.action);

  try
  {
    console.log('here');
  const title = req.params.title;
  let cart = await orderDetail.find();
  const  action = req.query.action;
  // console.log(cart);
  cart.forEach(carts => {
      if(carts.title == title){
          switch(action){
              case "add": carts.qty++; break;
              case "subtract": carts.qty--;
              if(carts.qty < 1)
              cart.splice(carts, 1); 
              break;
              case "clear": 
              cart.splice(carts, 1);
              if(carts.length == 0) delete req.session.cart;
              break;
              default:console.log('Update Problem'); break;
  
          }
      }
      console.log(carts);   
  });
 
  // await cart.save();
  // res.redirect('/everygreen');
}
catch(error){
  console.log(error);
}
  })
  
  


module.exports = router;