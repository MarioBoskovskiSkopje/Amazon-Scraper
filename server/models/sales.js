const mongoose = require('mongoose')
const Schema = mongoose.Schema

const salesSchema = new Schema({
  asin: String,
  qty: String,
  timestamp: String,
})

module.exports = mongoose.model('sales', salesSchema)
