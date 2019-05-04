const express = require('express');
const authorController = require('../controllers/api_authorsController');

function routes(Author) {
  const controller = authorController(Author);
  const authorRouter = express.Router();
  authorRouter.route('/')
    .post(controller.post)
    .get(controller.get);

  authorRouter.use('/:authorId', (req, res, next) => {
    /* this function is middleware, handles lookup logic for all CRUD functions going to this route
    which are all in the controller file
    */
    Author.findById(req.params.authorId, (err, author) => {
      if (err) {
        return res.send(err);
      }
      if (author) {
        req.author = author;
        return next(); // go onto next function in stack
      }
      return res.sendStatus(404); // author not found
    });
  });

  authorRouter.route('/:authorId')
    .get(controller.getOne)
    .put(controller.put)
    .patch(controller.patch)
    .delete(controller.del);

  return authorRouter;
}

module.exports = routes;
