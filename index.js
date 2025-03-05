const express = require('express')

const app = express()

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
        const person = phonebook[index]
        phonebook.splice(index, 1)

        response.status(204)
                .send(JSON.stringify(person))
        
        return
    }

    response.status(404)
            .send("Person not found")
})


const PORT = 3004
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})