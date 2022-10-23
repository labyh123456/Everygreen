const { default: mongoose } = require('mongoose');
const { boolean } = require('webidl-conversions');

const bookOrderSchema = new mongoose.Schema({
customerid:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Customer'
},
orderdate:{
    type:Date,
    required:true
},
shippingaddress:{
type:String,
required:true
},
recname:{
    type:String,
    required:true
},
recphone:{

    type:Number,
    required:true
},
paymentmethod:{
    type:String,
    required:true
},
ordertotal:{
    type:Number,
    required:true
},
orderqty:{
    type:Number,
    required:true
},
orderstatus:{
    type:String,
    default:"Processing"
}
});

module.exports = mongoose.model("bookOrder", bookOrderSchema);