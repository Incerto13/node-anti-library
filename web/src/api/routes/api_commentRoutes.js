const express = require('express');
const commentController = require('../controllers/api_commentsController');

function routes(Comment) {
  const controller = commentController(Comment);
  const commentRouter = express.Router();
  commentRouter.route('/')
    .post(controller.post)
    .get(controller.get);

  commentRouter.use('/:commentId', (req, res, next) => {
    /* this function is middleware, handles lookup logic for all CRUD functions going to this route
    which are all in the controller file
    */
    Comment.findById(req.params.commentId, (err, comment) => {
      if (err) {
        return res.send(err);
      }
      if (comment) {
        req.comment = comment;
        return next(); // go onto next function in stack
      }
      return res.sendStatus(404); // comment not found
    });
  });

  commentRouter.route('/:commentId')
    .get(controller.getOne)
    .put(controller.put)
    .patch(controller.patch)
    .delete(controller.del);

  return commentRouter;
}

module.exports = routes;
