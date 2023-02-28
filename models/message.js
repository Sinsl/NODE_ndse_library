const {Schema, model} = require('mongoose');

const messageSchema = new Schema(
  {
    textMessage: {
      type: String,
      required: true
    },
    roomId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    datetime: {
      type: String,
      required: true
    }
  })

module.exports = model('Message', messageSchema);