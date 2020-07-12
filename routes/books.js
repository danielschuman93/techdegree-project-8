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
router.get('/', asyncHandler(async (req, res,) => {
  res.render('index', { books: {}, title: "Library" });
}));

/* GET create new book form. */
router.get('/new', (req, res,) => {
  res.render('new-book', { book: {}, title: 'New Book' });
});

/* POST new book form. */
router.post('/new', asyncHandler(async(req, res,) => {
  const book = await Book.create(req.body);
  res.redirect('/' + book.id);
}));

/* GET book details form. */
router.get('/:id', (req, res,) => {
  res.render('respond with a resource');
});

/* POST update book details. */
router.post('/:id', (req, res,) => {
  res.render('respond with a resource');
});

/* POST delete book. */
router.post('/:id/delete', (req, res,) => {
  res.render('respond with a resource');
});


module.exports = router;
