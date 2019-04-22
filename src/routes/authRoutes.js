const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const authRouter = express.Router();

function router(nav) {
  authRouter.route('/signUp')
    .get((req, res) => {
      res.render('signUp', {
        nav,
        title: 'Sign Up',
        path: '/signup',
      });
    })
    .post((req, res) => { 
      debug(req.body);
      const { username, password, avatar, bio } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'anti_library';

      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server'); 

          const db = client.db(dbName);

          const col = db.collection('users');
          
          // need to define fields that aren't being entered here for userView to work
          const library = [];
          const anti_library = [];

          const hashedPassword = await bcrypt.hash(password, 12);
          const user = ({ username, password: hashedPassword, avatar, bio, library, anti_library });
          const results = await col.insertOne(user);
          

          debug(results);
          req.login(results.ops[0], () => {
            // this will redirect to the route below which just redirects to userView
            res.redirect('/auth/profile');
          });
        } catch (err) {
          debug(err);
        }
      }());
    });
  authRouter.route('/signIn')
    .get((req, res) => {
      res.render('signIn', {
        nav,
        title: 'Sign In',
        path: '/signin',
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/'
    }));
  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      const { _id } = req.user; // grab user id from req(uest) object
      res.redirect(`/users/${_id}`);
      // res.json(req.user);
    });
  authRouter.route('/logOut')
    .get((req, res) => {
      req.logout();
      res.redirect('/');
    });
  return authRouter;
}

module.exports = router;
