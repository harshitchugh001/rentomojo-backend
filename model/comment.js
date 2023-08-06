const mongoose = require('mongoose');
const shortid = require('shortid');

const CommentSchema = mongoose.Schema({
  comment_id: {
    type: String,
    required: true,
    unique: true,
    default: shortid.generate,
  },
  user: {
    type: String,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  like: {
    type: Number,
    default: 0,
  },
  dislike: {
    type: Number,
    default: 0,
  },
  user_actions: [
    {
      type: String,
      ref: 'User',
      required: true,
    },
  ],
});

module.exports = mongoose.model('Comment', CommentSchema);
