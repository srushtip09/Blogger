
const mongoose = require('mongoose')
const blogground = require('../models/blogground')
const cities = require('./cities')
const {places,descriptors} = require('./seedhelper')
mongoose.connect(`mongodb+srv://srushp:srushp@cluster0.z4fpb96.mongodb.net/?retryWrites=true&w=majority`).then(()=>{
    console.log("connected")
}).catch((error)=>{
    console.log("errorr",error)
})
const sample = array =>array[Math.floor(Math.random()*array.length)]

const seedDB = async()=>{
    const p = await blogground.deleteMany({})
    for(let i=0;i<50;i++){
        const random = Math.floor(Math.random()*1000)
        const blog = new blogground({
            author:'6496ee888d5c58afe3424604',
            location :`${cities[random].city}, ${cities[random].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            image : 'https://source.unsplash.com/collection/483251',
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum ipsam cumque nam, cupiditate dicta, ipsum soluta aliquid facilis facere, obcaecati animi necessitatibus repellendus labore in. Sint labore eos facere itaque.",
            price: Math.floor(Math.random()*20)+10
        })
        await blog.save()
    }
}
seedDB()

.then(()=>{
    mongoose.connection.close()
    console.log("connection closed")
})


