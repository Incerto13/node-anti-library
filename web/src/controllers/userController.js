const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:userController');

const dbName = 'nodeAntiLibrary';

function userController(MONGODB_URL) {
  function getIndex(req, res) {
    const { user } = req;

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(MONGODB_URL);
        debug('Connected correctly to server');
        
        const db = client.db(dbName);
      
        const col = await db.collection('users');
        
        const users = await col.find().toArray();
        
        if (req.user) {
          debug('reg.session');
          debug(req.user.username);
        }

        res.render(
          'userListView',
          {
            title: 'Users',
            users,
            user, // only way to send session user info, can't access req object directly from view
            path: '/users',
          }
        );
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }

  function updateLibrary(req, res) {
    const { book, form } = req.body;
    const { _id } = req.user; // can pull the current session user data from this object

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(MONGODB_URL);
        debug('Connected correctly to server');
        
        const db = client.db(dbName);

        const col = db.collection('users');

        const book_id = new ObjectID(book);

        const user_id = new ObjectID(_id);
        
        const updateUser = (async () => { 
          if (form == 'addToLibrary') {
            await col.updateOne(
              { _id: user_id },
              { $push: { library: book_id } }
            );
            debug(`adding to ${req.user.username}'s library...`);
          } else if (form == 'addToAntiLibrary') {
            await col.updateOne(
              { _id: user_id },
              { $push: { anti_library: book_id } }
            );
            debug(`adding to ${req.user.username}'s anti-library...`);
          } else if (form == 'deleteFromLibrary') {
            await col.updateOne(
              { _id: user_id },
              { $pull: { library: book_id } }
            );
            debug(`deleting from ${req.user.username}'s library...`);
          } else if (form == 'deleteFromAntiLibrary') {
            await col.updateOne(
              { _id: user_id },
              { $pull: { anti_library: book_id } }
            );
            debug(`deleting from ${req.user.username}'s anti-library...`);
          }
        });

        await updateUser();
        
        /* necessary to update / define user here after dbase has been updated
        because the req.login just persists with all the info in the 
        user object (doesn't check dbase) and updates req.user from 
        that object
        */
        const user = await col.findOne({ _id: new ObjectID(_id) });

        await req.logIn(user, (err, next) => {
          if (err) {
            return next(err);
          } 

          debug('USER: '); 
          debug(user);
          debug('REQ.USER: ');
          debug(req.user);

          return res.redirect(`/books/${book}`); // come back to the same book page after after updating library
        });
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
        client = await MongoClient.connect(MONGODB_URL);
        debug('Connected correctly to server');
        
        const db = client.db(dbName);

        const col = await db.collection('users');
        const colBooks = await db.collection('books');

        const user = await col.findOne({ _id: new ObjectID(id) });
        debug(user);
        
        const lib = [];
        const anti_lib = [];

        await Promise.all(user.library.map(async (book) => {
          const bookObj = new ObjectID(book);
          lib.push(bookObj);
        }));

        await Promise.all(user.anti_library.map(async (book) => {
          const bookObj = new ObjectID(book);
          anti_lib.push(bookObj);
        }));
        
        // collect all the books in the library and anti-library of this user
        const library = await colBooks.find({ _id: { $in: lib } }).toArray();
        const anti_library = await colBooks.find({ _id: { $in: anti_lib } }).toArray();
        
        res.render(
          'userView',
          {
            title: 'User',
            user, 
            library,
            anti_library,
            path: '/users',        
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
    updateLibrary,
    getById,
    middleware
  };
}

module.exports = userController;
