const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: String,
  name_en: String,
  category: String,
  image: String,
  location: String,
  phone: Number,
  google_map: String,
  rating: { type: Number, min: 1, max: 5 },
  description: String,
  required: false
})

module.exports = mongoose.model('Restaurant', restaurantSchema)
