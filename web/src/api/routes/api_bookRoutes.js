const express = require('express');
const bookController = require('../controllers/api_booksController');

function routes(Book) {
  const controller = bookController(Book);
  const bookRouter = express.Router();
  bookRouter.route('/')
    .post(controller.post)
    .get(controller.get);

  bookRouter.use('/:bookId', (req, res, next) => {
    /* this function is middleware, handles lookup logic for all CRUD functions going to this route
    which are all in the controller file
    */
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      if (book) {
        req.book = book;
        return next(); // go onto next function in stack
      }
      return res.sendStatus(404); // book not found
    });
  });

  bookRouter.route('/:bookId')
    .get(controller.getOne)
    .put(controller.put)
    .patch(controller.patch)
    .delete(controller.del);

  return bookRouter;
}

module.exports = routes;
