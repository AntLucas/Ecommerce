const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Product = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "categories",
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  unity: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model("products", Product)
