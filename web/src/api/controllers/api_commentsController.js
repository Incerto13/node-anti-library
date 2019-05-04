/* eslint-disable no-param-reassign */


function commentsController(Comment) {
  function post(req, res) {
    const comment = new Comment(req.body);
    comment.save();
    return res.status(201).json(comment);
  }

  function get(req, res) {
    const query = {};
    if (req.query.user) {
      query.user = req.query.user; // filters query strings that can be entered
    }
    if (req.query.book) {
      query.book = req.query.book; // filters query strings that can be entered
    }
    Comment.find(query, (err, comments) => {
      if (err) {
        return res.send(err);
      }
      // HATEOAS - Self-Documenting Hyperlinks within the API
      const returnComments = comments.map((comment) => {
        const newComment = comment.toJSON();
        newComment.links = {};
        newComment.links.self = `http://${req.headers.host}/api/comments/${comment._id}`;
        return newComment;
      });
      return res.json(returnComments);
    });
  }

  function getOne(req, res) {
    // HATEOAS to filter by category
    const returnComment = req.comment.toJSON();
    returnComment.links = {};
    return res.json(returnComment);
  }

  function put(req, res) {
    const { comment } = req;
    comment.user = req.body.user;
    comment.book = req.body.book;
    req.comment.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(comment);
    });
  }

  function patch(req, res) {
    const { comment } = req;
    // eslint-disable-next-line no-underscore-dangle
    if (req.body._id) {
      // eslint-disable-next-line no-underscore-dangle
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      comment[key] = value;
    });
    req.comment.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(comment);
    });
  }

  function del(req, res) {
    req.comment.remove((err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204); // successfully deleted
    });
  }

  // eslint-disable-next-line object-curly-newline
  return { post, get, getOne, put, patch, del };
}

module.exports = commentsController;
