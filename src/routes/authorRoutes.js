const express = require('express');
const authorController = require('../controllers/authorController');

const authorRouter = express.Router();
const bookService = require('../services/goodreadsService');

function router(nav) {
  const { getIndex, getById, middleware } = authorController(bookService, nav);
  authorRouter.use(middleware);
  authorRouter.route('/')
    .get(getIndex);

  authorRouter.route('/:id')
    .get(getById);

  return authorRouter;
}

module.exports = router;
