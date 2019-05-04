const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const { Schema } = mongoose;

const bookModel = new Schema({
  title: { type: String },
  author_id: { type: ObjectId, ref: 'Author' },
  genres: [{ type: String }],
  bookId: { type: Number }

});

module.exports = mongoose.model('Book', bookModel);
