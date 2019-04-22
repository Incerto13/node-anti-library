const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:authorController');

const url = 'mongodb://localhost:27017';
const dbName = 'nodeAntiLibrary';

function authorController(bookService, nav) {
  function getIndex(req, res) {

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');
        
        const db = client.db(dbName);
      
        const col = await db.collection('authors');
        
        const authors = await col.find().toArray();
      
        // retrieve details from API for all authors 
        await Promise.all(authors.map(async (author) => {
          author.details = await bookService.getAuthorById(author.authorId);
        }));

        res.render(
          'authorListView',
          {
            nav,
            title: 'Authors',
            authors,
            path: '/authors',
          }
        );
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }
  function getById(req, res) {
    const { id } = req.params;

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');
        
        const db = client.db(dbName);

        const col = await db.collection('authors');
        const colBooks = await db.collection('books');

        const author = await col.findOne({ _id: new ObjectID(id) });

        // will need to do a join/aggregate to be able to list all of the author's books here

        debug(author);

        author.details = await bookService.getAuthorById(author.authorId);

        const books = await colBooks.find({ author_id: new ObjectID(id) }).toArray();
        debug(books);

        res.render(
          'authorView',
          {
            nav,
            title: 'Author',
            author,
            books,
            path: '/authors',
          }
        );
      } catch (err) {
        debug(err.stack);
      }
    }());
  }

  function middleware(req, res, next) {
    //if (req.user) {
    next();
    //} else {
    // res.redirect('/');
    // }
  }

  return {
    getIndex,
    getById,
    middleware
  };
}

module.exports = authorController;
