const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  id: {
    type: Number,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  name_en: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  google_map: {
    type: String,
    required: false
  },
  rating: {
    type: Number,
    required: false,
    max: 5,
    min: 1
  },
  description: {
    type: String,
    required: false
  },
  // 加入關聯設定
  userId: {
    // type 跟 ref 為一組設定，意即「去參照 user model 的 ObjectId」 
    // type 定義資料類型為 ObjectId ，意指連向另一個資料物件
    type: Schema.Types.ObjectId,
    // 參考對象是 user model 的資料
    ref: 'User',
    index: true,
    required: true
  }
})

module.exports = mongoose.model('Restaurant', restaurantSchema)
