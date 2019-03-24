const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const { Schema } = mongoose;

const defaultAvatar = 'https://i.stack.imgur.com/IHLNO.jpg';

const emptyArray = [];

const userModel = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String },
  avatar: { type: String, default: defaultAvatar },
  bio: { type: String },
  library: [{
    type: ObjectId,
    ref: 'Book',
    default: emptyArray
  }], 
  anti_library: [{
    type: ObjectId,
    ref: 'Book',
    default: emptyArray
  }], 
  

});

module.exports = mongoose.model('User', userModel);
