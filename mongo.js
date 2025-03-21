const mongoose = require('mongoose');

let args = process.argv;

if(args.length < 3) {
    window.console.log("Please provide password as an argument");
    process.exit(1);
}

const password = args[2]
const url = `mongodb+srv://dustin99wii:${password}@cluster0.lyw8f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String
})

const PhoneEntry = mongoose.model("Phone", phoneSchema);

if (args.length != 3 && args.length != 5) {
    console.log("Please provide either no additional command line arguments or a name and phone number")
}


if (args.length == 3) {
    PhoneEntry.find({}).then(results => {
        if(results.length > 0)
            console.log("phonebook:")

        results.forEach(result => {
            console.log(`${result.name} ${result.number}`)
        });
        mongoose.connection.close();
    })
}

if (args.length == 5) {
    const entry = new PhoneEntry({
        name: args[3],
        number: args[4]
    })

    entry.save().then(entry => {
        console.log(entry);
        mongoose.connection.close();
    })
}


