const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type:String,
    required:true
  },
  quantity: {
    type: Number,
    required:true
  },

  expirationDate: {
    type:Date,
    required:true
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
