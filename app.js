const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const port = process.env.PORT || 3000;
const app = express();

const db = mongoose.connect('mongodb://localhost/anti_library', {
  useCreateIndex: true,
  useNewUrlParser: true
});

const User = require('./src/api/models/userModel');
const Book = require('./src/api/models/bookModel');
const Author = require('./src/api/models/authorModel');
const Comment = require('./src/api/models/commentModel');

const api_userRouter = require('./src/api/routes/api_userRoutes')(User);
const api_bookRouter = require('./src/api/routes/api_bookRoutes')(Book);
const api_authorRouter = require('./src/api/routes/api_authorRoutes')(Author);
const api_commentRouter = require('./src/api/routes/api_commentRoutes')(Comment);

app.use(morgan('tiny'));
app.use(bodyParser.json()); // this is necessary to pull post requests out and add to req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library' }));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, '/public/')));
// The following are the additional directories to look at for
// static files in addition to public directory
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' },
  { link: '/users', title: 'Users' }
];

app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  next();
});

const bookRouter = require('./src/routes/bookRoutes')(nav);
const authorRouter = require('./src/routes/authorRoutes')(nav);
const userRouter = require('./src/routes/userRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);

app.use('/books', bookRouter); 
app.use('/authors', authorRouter); 
app.use('/users', userRouter);
app.use('/admin', adminRouter);  
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.render(
    'index',
    {
      nav,    
      title: 'Anti-Library',
    }
  );
});

/* ***** API Routing ***** */
app.get('/api', (req, res) => {
  res.send('Welcome to the Anti-library API!');
});

app.use('/api/users', api_userRouter);
app.use('/api/books', api_bookRouter);
app.use('/api/authors', api_authorRouter);
app.use('/api/comments', api_commentRouter);

app.use((err, req, res, next) => {
  // log the error...
  // res.sendStatus(err.httpStatusCode).json(err);
  // or use this
  // res.json({message: error.message });
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
