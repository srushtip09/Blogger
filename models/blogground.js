const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
const BlogSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    // price:{
    //     type: Number,
    //     // required: true
    // },
    // location:{
    //     type: String,
    //     required: true
    // },
    description:{
        type: String,
        //required: true
    },
    image:{
        type: String,
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:'Review'
    }],
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
})
BlogSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Blog', BlogSchema);