const { default: mongoose } = require('mongoose');
const {boolean} = require('webidl-conversions');
const eBook = require('./book');
const categorySchema = new mongoose.Schema({
    name:{type:String, required:true, unique:true}
})

categorySchema.pre('remove', function(next){
eBook.find({categoryid:this.id}, (err, books) => {
    if(err){
        next(err)
    }else if(books.length > 0){
        next(new Error("This Category Has Books"))
    }else{
        next();
    }
})
})

module.exports = mongoose.model("categories", categorySchema);