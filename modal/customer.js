const { default: mongoose } = require('mongoose');
const {boolean} = require('webidl-conversions');

const customerSchema = new mongoose.Schema({
userid:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
},    
email:{type:String, required:true, unique:true},
fullname:{type:String, required:true, unique:true},
address:{type:String, required:true},
city:{type:String, required:true},
country:{type:String, required:true},
phonenumber:{type:String, required:true},
zipcode:{type:String, required:true},
// password:{type:String, required:true},
registerdate:{type:Date, required:true}
})

module.exports = mongoose.model("Customer", customerSchema);