/* eslint-disable no-param-reassign */


function authorsController(Author) {
  function post(req, res) {
    const author = new Author(req.body);
    author.save();
    return res.status(201).json(author);
  }

  function get(req, res) {
    const query = {};
    if (req.query.country) {
      query.country = req.query.country; // filters query strings that can be entered
    }
    Author.find(query, (err, authors) => {
      if (err) {
        return res.send(err);
      }
      // HATEOAS - Self-Documenting Hyperlinks within the API
      const returnAuthors = authors.map((author) => {
        const newAuthor = author.toJSON();
        newAuthor.links = {};
        newAuthor.links.self = `http://${req.headers.host}/api/authors/${author._id}`;
        return newAuthor;
      });
      return res.json(returnAuthors);
    });
  }

  function getOne(req, res) {
    // HATEOAS to filter by category
    const returnAuthor = req.author.toJSON();
    returnAuthor.links = {};
    return res.json(returnAuthor);
  }

  function put(req, res) {
    const { author } = req;
    author.name = req.body.name;
    req.author.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(author);
    });
  }

  function patch(req, res) {
    const { author } = req;
    // eslint-disable-next-line no-underscore-dangle
    if (req.body._id) {
      // eslint-disable-next-line no-underscore-dangle
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      author[key] = value;
    });
    req.author.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(author);
    });
  }

  function del(req, res) {
    req.author.remove((err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204); // successfully deleted
    });
  }

  // eslint-disable-next-line object-curly-newline
  return { post, get, getOne, put, patch, del };
}

module.exports = authorsController;
