const blogground = require('./models/blogground'); 

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        console.log(req.session.returnTo)
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/user/login');
    }
    next();
};
module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params
    const blog = await blogground.findById(id);
    console.log(blog.author)
    console.log(req.currentUser)
    if(!blog.author.equals(req.currentUser)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/bloggrounds/show/${blog.id}`)
    } else{
        next()
    }
}