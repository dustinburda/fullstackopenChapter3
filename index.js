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
  const body = (tokens.method(request, response) ===  'POST') ? JSON.stringify(request.body)
    : ''

  return [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens['response-time'](request, response), 'ms',
    body
  ].join(' ')
}))

app.get('/api/persons', (request, response) => {
  let phoneEntries = []

  PhoneEntry.find({}).then(entries => {
    phoneEntries = [...entries]

    console.log(entries)
    response.set({
      'Content-Type': 'application/json'
    })
    response.status(200)
      .send(JSON.stringify(phoneEntries))

  })
})

app.get('/info', (request, response) => {
  response.set({
    'Content-Type': 'text/plain'
  })

  const today = new Date(Date.now())

  PhoneEntry.countDocuments({}).then((count) => {
    response.status(200)
      .send(`Phonebook has info for ${count} people` + '\n' + `${today.toUTCString()}`)
  })
})

app.get('/api/persons/:id', (request, response) => {
  PhoneEntry.findById(request.params.id)
    .then(person => {
      if(!person) {
        response.status(404)
          .send('Person not found')
      } else {
        response.status(200)
          .send(JSON.stringify(person))
      }
    }).catch(error => console.log(error))
})

app.delete('/api/persons/:id', (request, response) => {
  console.log(request.params.id)
  PhoneEntry.findByIdAndDelete(request.params.id)
    .then(person => {
      if(!person) {
        response.status(404)
          .send('Person not found')
      } else {
        response.status(201)
          .send(JSON.stringify(person))
      }
    }).catch(error => console.log(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  PhoneEntry.findByIdAndDelete(request.params.id)
    .then(person => {
      if (!person) {
        response.status(404)
          .send('Person not found')
      }
    })


  const newPerson = new PhoneEntry ({
    ...request.body
  })
  newPerson.save().then(person => {
    console.log(person)
    response.status(201)
      .send(JSON.stringify(person))
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const person = request.body

  if (!Object.prototype.hasOwnProperty.call(person, 'name') || !Object.prototype.hasOwnProperty.call(person,'number')) {
    return response.status(404)
      .send(JSON.stringify({
        'error': 'name or number is missing'
      }))

  }

  let entry = new PhoneEntry({
    ...person
  })

  entry.save().then(newPerson => {
    response.set({
      'Content-Type': 'application/json'
    })
    response.status(201)
      .send(JSON.stringify(newPerson))
  }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    console.log('CastError')
    return response.status(404).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    console.log('ValidationError')
    return response.status(404).send({
      error: error.message
    })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})