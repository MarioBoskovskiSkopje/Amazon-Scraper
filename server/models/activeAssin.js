const mongoose = require('mongoose')
const Schema = mongoose.Schema

const activeAssinSchema = new Schema({
  asin: String,
  url: String,
})

module.exports = mongoose.model('assins', activeAssinSchema)
