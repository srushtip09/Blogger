const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const session = require('express-session')
const ejsmate = require('ejs-mate')
const mongoose = require('mongoose')
const User = require('./models/user');
const methodOverride = require('method-override')
const flash = require('connect-flash')
app.use(methodOverride('_method'))
const passport = require('passport')
const LocalStrategy = require('passport-local')
app.set('view engine', 'ejs');
app.engine('ejs',ejsmate)
app.use(express.urlencoded({extended:true}))
const blogground = require('./models/blogground')
app.use(express.static(path.join(__dirname,'public')))
const bloggroundRouter = require('./routes/blogground')
const UserRouter = require('./routes/user')
app.set('views', path.join(__dirname, 'views'));
mongoose.connect(`mongodb+srv://srushp:srushp@cluster0.z4fpb96.mongodb.net/?retryWrites=true&w=majority`).then(()=>{
    console.log("connected")
}).catch((error)=>{
    console.log("errorr",error)
})
const sessionConfig = {
    'secret':"thisisas",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now()+ 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
    
}
app.use(flash())
app.use(session(sessionConfig))



// app.get('/fakeNewUser',async(req,res)=>{
//     const user = new User({email:'srush@gmail.com',username:'srush'})
//     const newUser = await User.register(user,'srush')
//     res.send(newUser)
// })


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate(


    
)));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next()
})

const blogs = blogground.find({})
app.get('/', (req, res) => res.render('home',{blogs}));
app.use('/bloggrounds',bloggroundRouter);
app.use('/user',UserRouter);
app.listen(port, () => console.log(`listening on port ${port}!`));




