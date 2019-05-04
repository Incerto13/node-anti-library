const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();
const bookService = require('../services/goodreadsService');

function router(MONGODB_URL) {
  const { getIndex, updateLibrary, getById, middleware } = userController(MONGODB_URL, bookService);
  userRouter.use(middleware);
  userRouter.route('/')
    .get(getIndex);

  userRouter.route('/update-library')
    .post(updateLibrary);

  userRouter.route('/:id')
    .get(getById);

  return userRouter;
}

module.exports = router;
