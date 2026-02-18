// Handles returning all recent posts for user
async function posts_get(req, res, next) {
  res.json({ title: 'GET posts route' });
}

// Handles getting selected post
async function selected_post_get(req, res, next) {
  res.json({
    title: 'GET selected post route',
    postId: req.params.postId,
  });
}

// Handles getting info needed to create or update a post
async function create_post_get(req, res, next) {
  res.json({ title: 'GET post/create Route' });
}

// Handles getting info needed to create or update a post
async function create_post_post(req, res, next) {
  res.json({ title: 'POST post/create Route' });
}

// Handles updating selected post
async function update_post_put(req, res, next) {
  res.json({ title: 'PUT post/update route' });
}

// Handles updating selected post
async function delete_post(req, res, next) {
  res.json({ title: 'DELETE post/delete route' });
}

export default {
  posts_get,
  selected_post_get,
  create_post_get,
  create_post_post,
  update_post_put,
  delete_post,
};
