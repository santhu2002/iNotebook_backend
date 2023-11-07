const mongoose = require('mongoose');


// const mongoURI = "mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
const mongoURI ="mongodb+srv://Santhosh:root@cluster0.xaq7wrl.mongodb.net/"

const connectToMongo =()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to mongo succcessfully")
    })
}

module.exports = connectToMongo