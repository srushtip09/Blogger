const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const {isLoggedIn} = require('../middleware')
router.get('/register',(req,res)=>{
    res.render('user/register')
})
router.post('/register',async(req,res)=>{
        const {email,username,password} = req.body;
        const user = new User({email,username})
        const newUser = await User.register(user,password)
        //console.log(newUser)
        req.login(newUser,function(err) {
            if (err) { return next(err); }
            req.flash('success','Welcome to Yelp blog')
            res.redirect('/bloggrounds')
        })
        
})
router.get('/login', (req,res)=>{
    res.render('user/login')
})

router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect:'/user/login',keepSessionInfo: true}),(req,res)=>{
    req.flash('success',"Welcome Back")
    if(req.method === 'POST'){
        req.session.returnTo = '/bloggrounds'
    }
    const redirectUrl = req.session.returnTo || '/bloggrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})
router.get('/logout',(req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success','Goodbye')
        res.redirect('/bloggrounds');
      });
})
module.exports = router;