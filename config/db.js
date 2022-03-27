const mongoose = require('mongoose')
const mongo_uri = 'mongodb://localhost:27017/FMS'
try {
  mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
} catch (err) {
  console.log('error: ', err)
}

console.log(`Mongoose Connected locally`)

module.exports = { mongo_uri }
