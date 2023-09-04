const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to DB')
mongoose.connect(url)
    .then(result => {
        console.log('connected to DB')
    })
    .catch((error) => {
        console.log('error connecting to DB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function (v) {
                if (!/\d{2}-/.test(v) && !/\d{3}-/.test(v)) {
                    return /\d{2}-/.test(v);
                }
              
            },
            message: '{VALUE} is not a valid number!'
          }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Contacts', personSchema)