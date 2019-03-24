const express = require('express');
const bookController = require('../controllers/bookController');

const bookRouter = express.Router();
const bookService = require('../services/goodreadsService');

function router(nav) {
  const { getIndex, getAddBook, postAddBook, postBookComment, getById, middleware } = bookController(bookService, nav);
  bookRouter.use(middleware);
  bookRouter.route('/')
    .get(getIndex);
    
  bookRouter.route('/add')
    .get(getAddBook)
    .post(postAddBook);

  bookRouter.route('/:id') // must be the last router defines or else 'Argument passed must be String of 12 bytes' error
    .get(getById)
    .post(postBookComment);


  return bookRouter;
}

module.exports = router;
