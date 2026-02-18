// Handles returning all recent posts for user
async function postsGet(req, res, next) {
  res.json({ title: 'GET posts route' });
}

// Handles getting selected post
async function selectedPostGet(req, res, next) {
  res.json({
    title: 'GET selected post route',
    postId: req.params.postId,
  });
}

// Handles getting info needed to create or update a post
async function createPostGet(req, res, next) {
  res.json({ title: 'GET post/create Route' });
}

// Handles getting info needed to create or update a post
async function createPostPost(req, res, next) {
  res.json({ title: 'POST post/create Route' });
}

// Handles updating selected post
async function updatePostPut(req, res, next) {
  res.json({ title: 'PUT post/update route' });
}

// Handles updating selected post
async function deletePost(req, res, next) {
  res.json({ title: 'DELETE post/delete route' });
}

export default {
  postsGet,
  selectedPostGet,
  createPostGet,
  createPostPost,
  updatePostPut,
  deletePost,
};
