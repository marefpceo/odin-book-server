// Returns responses for root directory
exports.indexRoute = async (req, res, next) => {
  res.json({ title: 'Express API Template' });
};
