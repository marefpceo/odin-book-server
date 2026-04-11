// Middleware function to protect routes by verifying user authentication

async function verifyValidSession(req, res, next) {
  const session = req.session.passport;

  if (!session) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
  next();
}

export { verifyValidSession };
