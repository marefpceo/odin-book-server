const { title } = require('node:process');

// Handles returning all recent posts for user
exports.posts_get = async (req, res, next) => {
  res.json({ title: 'GET posts route' });
};

// Handles getting selected post
exports.selected_post_get = async (req, res, next) => {
  res.json({
    title: 'GET selected post route',
    postId: req.params.postId,
  });
};

// Handles getting info needed to create or update a post
exports.create_post_get = async (req, res, next) => {
  res.json({ title: 'GET post/create Route' });
};

// Handles getting info needed to create or update a post
exports.create_post_post = async (req, res, next) => {
  res.json({ title: 'POST post/create Route' });
};

// Handles updating selected post
exports.update_post_put = async (req, res, next) => {
  res.json({ title: 'PUT post/update route' });
};

// Handles updating selected post
exports.delete_post = async (req, res, next) => {
  res.json({ title: 'DELETE post/delete route' });
};
