const express = require('express');
const router = express.Router();

const indexRouter = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexRouter.indexRoute);

module.exports = router;
