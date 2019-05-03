const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemsSchema = new Schema({
  asin: String,
  qty: String,
  timestamp: String,
  datecreated: String,
  price: String,
  reviews: String,
  salesrank: String,
  amazonChoice: String,
  badgebestSeller: String,
  salesStars: String,
})

module.exports = mongoose.model('items', itemsSchema)
