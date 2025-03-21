const mongoose = require('mongoose');

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)
        .then(result => console.log("Successfully connected to MongoDB"))
        .catch(error => console.log("Error connecting to MongoDB", error.message))

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String
})

phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Phone", phoneSchema);

