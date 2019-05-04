const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const { Schema } = mongoose;

const commentModel = new Schema({
  user_id: { type: ObjectId, ref: 'User' },
  book_id: { type: ObjectId, ref: 'Book' },
  text: { type: String },

});

module.exports = mongoose.model('Comment', commentModel);
