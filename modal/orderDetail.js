const { default: mongoose } = require('mongoose');
const { boolean } = require('webidl-conversions');

const orderDetailSchema = new mongoose.Schema({
orderid:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'bookOrder'
},
userid:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'customer'
},
cart:{type:Object, required:true}
// bookid:[
//     {
//         type:mongoose.Schema.Types.ObjectId,
//         required:true,
//         ref:'Book',
        
//     }
// ],
// quantity:[
// {
//     type:Number,
//     // required:true
// }
// ],
// subtotal:[
// {
//     type: Number,
//     // required:true
// }
// ],
})
module.exports = mongoose.model("orderDetail", orderDetailSchema);