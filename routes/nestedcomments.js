const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const shortid = require('shortid');

const NestedCommentSchema = mongoose.Schema({
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

const NestedComment = mongoose.model('NestedComment', NestedCommentSchema);

router.post('/post-nested-comment', async (req, res) => {
  try {
    const { text, parentCommentId, userId } = req.body;

    const collectionName = `nested_comments_${parentCommentId}`;
    const NestedCommentModel = mongoose.model('NestedComment', NestedCommentSchema, collectionName);
    console.log(collectionName);

    const newNestedComment = new NestedCommentModel({
      user: userId,
      text,
      parentCommentId,
    });
    
    await newNestedComment.save();

    return res.status(201).json(newNestedComment);
  } catch (error) {
    console.error('POST NESTED COMMENT ERROR:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

router.get('/get-nested-comments/:parentCommentId', async (req, res) => {
  try {
    const { parentCommentId } = req.params;

    const collectionName = `nested_comments_${parentCommentId}`;

    const NestedCommentModel = mongoose.model('NestedComment', NestedCommentSchema, collectionName);

    const nestedComments = await NestedCommentModel.find();

    return res.json(nestedComments);
  } catch (error) {
    console.error('GET NESTED COMMENTS ERROR:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

router.post('/nested-like', async (req, res) => {
  try {
    const { parentCommentId, commentId, userId } = req.body;
    console.log(req.body);

    const collectionName = `nested_comments_${parentCommentId}`;

    const NestedCommentModel = mongoose.model('NestedComment', NestedCommentSchema, collectionName);
    const nestedComment = await NestedCommentModel.findById(commentId);
    console.log(nestedComment);

    if (!nestedComment) {
      return res.status(200).json({ message: 'Nested comment not found.' });
    }

    if (nestedComment.user_actions.includes(userId)) {
      return res.status(200).json({ message: 'User has already liked this comment.' });
    }
    if (nestedComment.user == userId) {
      
      return res.status(200).json({ message: 'You are not allowed to like your own comment' });
      
    }
    

    
    nestedComment.user_actions.push(userId);
    nestedComment.like++;

    await nestedComment.save();

    return res.json({ message: 'Like successful.' });
  } catch (error) {
    console.error('LIKE ERROR:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});


router.post('/nested-dislike', async (req, res) => {
  try {
    const { parentCommentId, commentId, userId } = req.body;
    console.log(req.body);
  

    const collectionName = `nested_comments_${parentCommentId}`;

    const NestedCommentModel = mongoose.model('NestedComment', NestedCommentSchema, collectionName);
    const nestedComment = await NestedCommentModel.findById(commentId);

    if (!nestedComment) {
      return res.status(200).json({ message: 'Nested comment not found.' });
    }

    if (nestedComment.user_actions.includes(userId)) {
      return res.status(200).json({ message: 'User has already disliked this comment.' });
    }
    if (nestedComment.user == userId) {
      // console.log(nestedComment.user,userId);
      // console.log("not liked");
      return res.status(200).json({ message: 'You are not allowed to like your own comment' });
      
    }
    // console.log("liked");
    
    if (nestedComment.user_actions.includes(userId)) {
      nestedComment.user_actions = nestedComment.user_actions.filter((action) => action !== userId);
      nestedComment.like--;
    }

    
    nestedComment.user_actions.push(userId);
    nestedComment.dislike++;

    await nestedComment.save();

    return res.json({ message: 'Dislike successful.' });
  } catch (error) {
    console.error('DISLIKE ERROR:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});


module.exports = router;
