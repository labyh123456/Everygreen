const { default: mongoose } = require('mongoose');
const {boolean} = require('webidl-conversions');

const reviewSchema = new mongoose.Schema({
bookid:{type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'eBook'},
customerid:{type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Customer'},
rating:{
    type:Number, required:true
},
headline:{  type:String, required:true},
comment:{ type:String, required:true},
reviewtime:{type:Date, required:true}        
})

module.exports = mongoose.model("Review", reviewSchema);