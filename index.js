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
    response.status(200)
            .send(`Phonebook has info for ${phonebook.length} people` + "\n" + `${today.toUTCString()}`)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = phonebook.find(entry => entry.id === id)

    if (person !== undefined) {
        response.set({
            "Content-Type": "application/json"
        })
        response.status(200)
                .send(JSON.stringify(person))
        return
    }

    response.status(404)
            .send("Person not found!")
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const index = phonebook.findIndex(entry => entry.id === id)
    
    if (index != -1) {
        const person = structuredClone(phonebook[index])
        phonebook.splice(index, 1)
        
        return response.status(204)
                .send(JSON.stringify(person))
    }

    response.status(404)
            .send("Person not found")
})

app.put("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const index = phonebook.findIndex(entry => entry.id === id)
    
    if (index != -1) {
        const person = request.body
        phonebook[index] = person

        console.log(person)
        return response.status(200)
                .send(JSON.stringify(person))
    }

    response.status(404)
            .send("Person not found")
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
        response.status(200)
                .send(JSON.stringify(person))
    })    
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})