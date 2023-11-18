const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const ejsmate = require('ejs-mate')
const mongoose = require('mongoose')
const blogground = require('../models/blogground')
const Review = require('../models/review')
const {isLoggedIn,isAuthor} = require('../middleware')
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
app.engine('ejs',ejsmate)
app.use(express.urlencoded({extended:true}))


router.get('/',async(req,res)=>{
    const blogs = await blogground.find({})
    res.render('blogground/index',{blogs})
})

router.post('/',isLoggedIn,async(req,res)=>{
    const blog = await new blogground(req.body);
    blog.author = req.user._id;
    await blog.save();
    req.flash('success','Successfully made a new blog')
    //console.log(req.body)
    res.redirect(`/bloggrounds/show/${blog._id}`)
})
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('blogground/new');
})
router.get('/edit/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params
    const blog = await blogground.findById(id);
    console.log(blog)
    res.render('blogground/edit',{blog})
})
router.get('/show/:id',async(req,res)=>{
    const {id} = req.params
    const blog = await blogground.findById(id).populate('reviews').populate('author');
    //console.log(blog)
    const reviews = await Review.find({blogground:id}).populate('owner')
    res.render('blogground/show',{blog,reviews})
   
})

router.get('/delete/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params
    const blog = await blogground.findById(id);
    res.render('blogground/delete',{blog})
   
})
router.delete('/:id/reviews/:reviewId',isLoggedIn,async(req,res)=>{
    const {id,reviewId} = req.params
    await blogground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/bloggrounds/show/${id}`)
})
router.post('/reviews/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params
    const blog = await blogground.findById(id);
    console.log("this")
    const review = await new Review(req.body);
    review.owner = req.user._id;
    review.blogground = blog._id;
    blog.reviews.push(review);
    await review.save();
    await blog.save();
    console.log(blog)
    res.redirect(`/bloggrounds/show/${blog._id}`)
})

router.delete('/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params
    const blog = await blogground.findByIdAndDelete(id);
    res.redirect('/bloggrounds')
})
router.patch('/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params
    const blog = await blogground.findByIdAndUpdate(id,req.body);
    res.redirect(`/bloggrounds/show/${blog._id}`)
})
module.exports = router;