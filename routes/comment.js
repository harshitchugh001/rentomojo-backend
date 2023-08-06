const express = require('express');
const router = express.Router();
const Comment = require('../model/comment');

router.post('/post-comments', async (req, res) => {
  const { text, userId } = req.body;

  try {
    const newComment = {
      text,
      user: userId,
    };
    const newlyCreated = await Comment.create(newComment);
    res.json(newlyCreated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating comment' });
  }
});

router.get('/get-comments', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

router.post('/like', async (req, res) => {
  try {
    // console.log(comment.user);
    const { commentId, userId } = req.body;
    console.log(req.body,);

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    // console.log(Number(comment.user),userId);
    // console.log(Number(comment.user)===userId);
    // console.log(typeof(Number(comment.user)));
    // console.log(typeof(userId));
    if (comment.user == userId) {
      return res.status(200).json({ message: 'You are not allowed to like your own comment' });
    }

    const hasLiked = comment.user_actions.includes(userId);

    if (!hasLiked) {
      comment.like++;
      comment.user_actions.push(userId);
      await comment.save();
    }

    res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating like' });
  }
});

router.post('/dislike', async (req, res) => {
  try {
    const { commentId, userId } = req.body;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user == userId) {
      return res.status(200).json({ message: 'You are not allowed to dislike your own comment' });
    }

    const hasDisliked = comment.user_actions.includes(userId);

    if (!hasDisliked) {
      comment.dislike++;
      comment.user_actions.push(userId);
      await comment.save();
    }

    res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating dislike' });
  }
});


module.exports = router;
