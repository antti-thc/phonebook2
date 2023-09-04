const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error:'malformated id'})
    } else if (error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
    next(error)
}

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', function(request, response ) { 
    if (request.method === "POST") {  
        return `${JSON.stringify(request.body)}`
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/',(request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons',(request,response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    let pvm = Date()
    Person.find({}).then(persons =>{
        response.send(`Phonebook contains info of ${persons.length} contacts.`+ "<br>" + pvm)
    })    
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
        
    const person = new Person({
        name: body.name,
        number: body.number,
        })
        
    person.save().then(savedContact => {
        response.json(savedContact)
        })
        .catch(error => next(error))
    })
    
app.put('/api/persons/:id', (request, response, next) =>{
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }
    Person.findByIdAndUpdate(request.params.id, person,{new: body.number})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error =>next(error))
})

app.get('/api/persons/:id', (request, response, next) =>{
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }       
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
  })

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})