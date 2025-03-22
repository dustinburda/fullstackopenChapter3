require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const PhoneEntry = require('./models/phone')

const app = express()
app.use(express.static('dist'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan((tokens, request, response) => {
    const body = (tokens.method(request, response) ==  "POST") ? JSON.stringify(request.body) 
                                                               : "";

    return [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens['response-time'](request, response), 'ms',
        body
    ].join(' ')
}))

app.get("/api/persons", (request, response) => {
    let phoneEntries = []

    PhoneEntry.find({}).then(entries => {
        phoneEntries = [...entries]

        response.set({
            "Content-Type": "application/json"
        })
        response.status(200)
                .send(JSON.stringify(phoneEntries))

    })
})

app.get("/info", (request, response) => {
    response.set({
        "Content-Type": "text/plain"
    })

    const today = new Date(Date.now())

    PhoneEntry.countDocuments({}).then((count) => {  
        response.status(200)
            .send(`Phonebook has info for ${count} people` + "\n" + `${today.toUTCString()}`)
    })
})

app.get("/api/persons/:id", (request, response) => {
    PhoneEntry.findById(request.params.id)
              .then(person => {
                if(!person) {
                    response.status(404)
                            .send("Person not found")
                } else {
                    response.status(200)
                    .send(JSON.stringify(person))
                }
              }).catch(error => console.log(error));
})

app.delete("/api/persons/:id", (request, response) => {
    PhoneEntry.findByIdAndDelete(request.params.id)
              .then(person => {
                if(!person) {
                    response.status(404)
                            .send("Person not found")
                } else {
                    response.status(201)
                    .send(JSON.stringify(person))
                }
              }).catch(error => console.log(error));
})

app.put("/api/persons/:id", (request, response) => {
    const id = request.params.id

    PhoneEntry.findByIdAndDelete(request.params.id)
              .then(person => {
                if (!person) {
                    response.status(404)
                            .send("Person not found")
                }
              })


    const newPerson = new PhoneEntry ({
        ...request.body
    });
    newPerson.save().then(person => {
        console.log(person);
        response.status(201)
                .send(JSON.stringify(person));
    })
})

app.post("/api/persons", (request, response) => {
    const person = request.body

    if (!person.hasOwnProperty('name') || !person.hasOwnProperty('number')) {
        return response.status(404)
                .send(JSON.stringify({
                    "error": "name or number is missing"
                }))
    
    }

    let entry = new PhoneEntry({
        name: person.name,
        number: person.number
    })

    entry.save().then(entry => {
        response.set({
            "Content-Type": "application/json"
        })
        response.status(201)
                .send(JSON.stringify(person))
    })    
})

const errorHandler = (error, request, response, next) => {
    console.log(error);
    if (error.name === 'CastError') {
        return response.status(404).send({
            error: "malformatted id"
        })
    }
}

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})