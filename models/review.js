const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');  
const blogground = require('./blogground');
const ReviewSchema = new Schema({
    body:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    blogground:{
        type: Schema.Types.ObjectId,
        ref: 'blogground'
    }
    
})

module.exports = mongoose.model('Review', ReviewSchema);