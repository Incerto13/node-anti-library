const mongoose = require('mongoose');

const { Schema } = mongoose;

const authorModel = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  authorId: { type: Number }

});

module.exports = mongoose.model('Author', authorModel);
