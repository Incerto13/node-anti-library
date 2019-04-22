const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

const url = 'mongodb://localhost:27017';
const dbName = 'nodeAntiLibrary';

function bookController(bookService, nav) {
  function getIndex(req, res) {

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');
        
        const db = client.db(dbName);
      
        // $loookup ~ join in Mongo to match author w/ same _id (which must be an ObjectId)
        const books = await db.collection('books').aggregate([
          {
            $lookup: { 
              from: 'authors',
              localField: 'author_id',
              foreignField: '_id',
              as: 'author'
            }
          },
          {
            $project: {
              _id: 1,
              title: 1,
              bookId: 1,
              author_name: '$author.name',
            }
          }
        ]).toArray();

        // retrieve details from API for all books so you can display image for each book 
        await Promise.all(books.map(async (book) => {
          book.details = await bookService.getBookById(book.bookId);
        }));

        res.render(
          'bookListView',
          {
            nav,
            title: 'Books',
            books,
            path: '/books',
          }
        );
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }

  function getAddBook(req, res) {

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');
        
        const db = client.db(dbName);

        const col = db.collection('authors');
       
        const authors = await col.find().toArray();

        res.render('addBook', {
          nav,
          title: 'Add Book',
          authors,
          path: '/books/add',

        });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }


  function postAddBook(req, res) {
    const { title, bookId, author } = req.body;

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');
        
        const db = client.db(dbName);

        const col = db.collection('books');

        const author_id = new ObjectID(author);

        const book = ({ title, bookId, author_id });

        const results = await col.insertOne(book);
       
        debug(results);
        res.redirect('/books');
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }

  function postBookComment(req, res) {
    const { book, text } = req.body;
    const { _id } = req.user; // can pull the current session user data from this object

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');
        
        const db = client.db(dbName);

        const col = db.collection('comments');

        const book_id = new ObjectID(book);

        const user_id = new ObjectID(_id);
        
        const comment = ({ book_id, user_id, text });

        const results = await col.insertOne(comment);
        
        
        debug(results);
        res.redirect(`/books/${book}`); // come back to the same page after posting comment
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }
  
  function getById(req, res) {
    const { id } = req.params;
    let { user } = req;

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');
        
        const db = client.db(dbName);

        const colBooks = await db.collection('books');
        const colUsers = await db.collection('users');
        

        // join comments w/ users on user_id field 
        const colComments = await db.collection('comments').aggregate([
          {
            $lookup: { 
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $project: {
              _id: 1,
              user_id: 1,
              book_id: 1,
              text: 1,
              user_username: '$user.username',
              user_avatar: '$user.avatar' 
            }
          }
        ]).toArray();
        
        const book = await colBooks.findOne({ _id: new ObjectID(id) });
       
        const comments = [];
        
        // push all comments for this particular book into the comments array
        await Promise.all(colComments.map(async (comment) => {
          if (comment.book_id == id) {
            comments.push(comment);
          }          
        }));

        
        let libraryIndex = -1;
        let anti_libraryIndex = -1;

        if (req.user) { 
          debug(req.user);
          // const { _id } = user;
          // user = await colUsers.findOne({ _id: new ObjectID(_id) });
          libraryIndex = req.user.library.indexOf(id);
          anti_libraryIndex = req.user.anti_library.indexOf(id);
        } 
        

        debug('**** Session user information ****');
        // debug(`library: ${library}`);
        // debug(`anti_library: ${anti_library}`);
        debug('req.user: ');
        debug(req.user);
        debug('user: ');
        debug(user);
        debug(`libraryIndex: ${libraryIndex}`);
        debug(`anti_libraryIndex: ${anti_libraryIndex}`);


        book.details = await bookService.getBookById(book.bookId);
        res.render(
          'bookView',
          {
            nav,
            title: 'Book',
            book, 
            comments,
            user,
            libraryIndex,
            anti_libraryIndex,
            path: '/books',
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
    getAddBook,
    postAddBook,
    postBookComment,
    getById,
    middleware
  };
}

module.exports = bookController;
