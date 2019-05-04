/* eslint-disable no-param-reassign */


function booksController(Book) {
  function post(req, res) {
    const book = new Book(req.body);
    book.save();
    return res.status(201).json(book);
  }

  function get(req, res) {
    const query = {};
    if (req.query.author) {
      query.author = req.query.author; // filters query strings that can be entered
    }
    if (req.query.genre) {
      query.genre = req.query.genre; // filters query strings that can be entered
    }
    Book.find(query, (err, books) => {
      if (err) {
        return res.send(err);
      }
      // HATEOAS - Self-Documenting Hyperlinks within the API
      const returnBooks = books.map((book) => {
        const newBook = book.toJSON();
        newBook.links = {};
        newBook.links.self = `http://${req.headers.host}/api/books/${book._id}`;
        return newBook;
      });
      return res.json(returnBooks);
    });
  }

  function getOne(req, res) {
    // HATEOAS to filter by category
    const returnBook = req.book.toJSON();
    returnBook.links = {};
    return res.json(returnBook);
  }

  function put(req, res) {
    const { book } = req;
    book.title = req.body.title;
    book.author = req.body.author;
    book.bookId = req.body.bookId;
    book.genre = req.body.genre;
    book.read = req.body.read;
    req.book.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(book);
    });
  }

  function patch(req, res) {
    const { book } = req;
    // eslint-disable-next-line no-underscore-dangle
    if (req.body._id) {
      // eslint-disable-next-line no-underscore-dangle
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      book[key] = value;
    });
    req.book.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(book);
    });
  }

  function del(req, res) {
    req.book.remove((err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204); // successfully deleted
    });
  }

  // eslint-disable-next-line object-curly-newline
  return { post, get, getOne, put, patch, del };
}

module.exports = booksController;
