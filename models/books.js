const {Schema, model} = require('mongoose');

const booksSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  authors: {
    type: String,
    required: true
  },
  favorite: {
    type: String,
    default: ''
  },
  fileCover: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  filePath: {
    type: String,
    default: ''
  }
});

module.exports = model('Books', booksSchema);