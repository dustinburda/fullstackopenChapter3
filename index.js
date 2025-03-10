const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()
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

const phonebook =[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.set({
        "Content-Type": "application/json"
    })
    response.status(200)
            .send(JSON.stringify(phonebook))
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

        response.status(204)
                .send(JSON.stringify(person))
        
        return
    }

    response.status(404)
            .send("Person not found")
})

app.post("/api/persons", (request, response) => {
    const person = request.body

    if (!person.hasOwnProperty('name') || !person.hasOwnProperty('number')) {
        response.status(404)
                .send(JSON.stringify({
                    "error": "name or number is missing"
                }))
        
        return;
    }

    if(phonebook.findIndex(personObj => personObj.name === person.name) != -1) {
        response.status(404)
                .send(JSON.stringify({
                    "error": "name must be unique"
                }))
        
        return;
    }

    person.id = String(Math.ceil(Math.random() * 10000 + 1))

    phonebook.push(person)

    response.set({
        "Content-Type": "application/json"
    })
    response.status(200)
            .send(JSON.stringify(person))

})

const PORT = 3006
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})