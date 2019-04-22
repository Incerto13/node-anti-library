const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRoutes');

const adminRouter = express.Router();
// use this to enter a bunch of books (or anything else) at once
const books = [
  {
    title: 'War and Peace',
    genre: 'Historical Fiction',
    author: 'Lev Nikokaliasdch Tolstoy',
    bookId: 656,
    read: false
  },
];


function router(nav) {
  adminRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'nodeAntiLibrary';

      (async function mong() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');
          
          const db = client.db(dbName);

          const response = await db.collection('books').insertMany(books);
          res.json(response);
        } catch (err) {
          debug(err.stack);
        }

        client.close();
      }());
    });
  return adminRouter;
}

module.exports = router;
