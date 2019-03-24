/* eslint-disable no-param-reassign */


function usersController(User) {
  function post(req, res) {
    const user = new User(req.body);
    user.save();
    return res.status(201).json(user);
  }

  function get(req, res) {
    const query = {};
    User.find(query, (err, users) => {
      if (err) {
        return res.send(err);
      }
      // HATEOAS - Self-Documenting Hyperlinks within the API
      const returnUsers = users.map((user) => {
        const newUser = user.toJSON();
        newUser.links = {};
        newUser.links.self = `http://${req.headers.host}/api/users/${user._id}`;
        return newUser;
      });
      return res.json(returnUsers);
    });
  }

  function getOne(req, res) {
    // HATEOAS to filter by category
    const returnUser = req.user.toJSON();
    returnUser.links = {};
    return res.json(returnUser);
  }

  function put(req, res) {
    const { user } = req;
    user.username = req.body.username;
    user.password = req.body.password;
    user.bio = req.body.bio;
    user.library = req.body.library;
    user.anti_library = req.body.anti_library;
    req.user.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(user);
    });
  }

  function patch(req, res) {
    const { user } = req;
    // eslint-disable-next-line no-underscore-dangle
    if (req.body._id) {
      // eslint-disable-next-line no-underscore-dangle
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      user[key] = value;
    });
    req.user.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(user);
    });
  }

  function del(req, res) {
    req.user.remove((err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204); // successfully deleted
    });
  }

  // eslint-disable-next-line object-curly-newline
  return { post, get, getOne, put, patch, del };
}

module.exports = usersController;
