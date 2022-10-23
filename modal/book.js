const { default: mongoose } = require('mongoose');
const { boolean } = require('webidl-conversions');
const coverImageBasePath = 'uploads/bookCovers';
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    desc: { type: String, required: true },
    isbn: { type: String, required: true },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    price:{
        type:Number,
        required:true
    },
    publishdate:{
        type:Date,
        required:true
    },
    lastupdate:{
        type:Date,
        required:true
    },
    categoryid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'categories'
    },
    bookrating:[
        {
            type:Number,
            default:0.0
        }
    ]

})
bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null  && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64, ${this.coverImage.toString('base64')}`
    }
    else 
    console.log('cannot find name of image');   
    })

module.exports = mongoose.model("eBook", bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;