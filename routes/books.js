const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

/* GET books listing. */
router.get('/books', asyncHandler(async (req, res,) => {
  res.render('index', { books: {}, title: "Library" });
}));

/* GET create new book form. */
router.get('/books/new', (req, res,) => {
  res.render('new-book', { book: {}, title: 'New Book' });
});

/* POST new book form. */
router.post('/', asyncHandler(async(req, res,) => {
  const book = await Book.create(req.body);
  res.redirect('/books/' + book.id);
}));

/* GET book details form. */
router.get('/books/:id', (req, res,) => {
  res.render('respond with a resource');
});

/* POST update book details. */
router.post('/books/:id', (req, res,) => {
  res.render('respond with a resource');
});

/* POST delete book. */
router.post('/books/:id/delete', (req, res,) => {
  res.render('respond with a resource');
});


module.exports = router;
