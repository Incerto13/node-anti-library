const express = require('express');
const userController = require('../controllers/api_usersController');

function routes(User) {
  const controller = userController(User);
  const userRouter = express.Router();
  userRouter.route('/')
    .post(controller.post)
    .get(controller.get);

  userRouter.use('/:userId', (req, res, next) => {
    /* this function is middleware, handles lookup logic for all CRUD functions going to this route
    which are all in the controller file
    */
    User.findById(req.params.userId, (err, user) => {
      if (err) {
        return res.send(err);
      }
      if (user) {
        req.user = user;
        return next(); // go onto next function in stack
      }
      return res.sendStatus(404); // user not found
    });
  });

  userRouter.route('/:userId')
    .get(controller.getOne)
    .put(controller.put)
    .patch(controller.patch)
    .delete(controller.del);

  return userRouter;
}

module.exports = routes;
