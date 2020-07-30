const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require('sequelize');
const paginate = require('express-paginate');

/* Function to check for SequelizeValidationError */
function checkError(error, req, res){
  if(error.name === 'SequelizeValidationError'){
    const errors = error.errors.map(err => err.message);
    console.error('Validation errors: ', errors);
    res.render('new-book', { book: req.body, errors: errors });
    return true;
  } else {
    return false;
  }
}

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      if (checkError(error, req, res)) {
        return;
      } else {
        throw error;
      }
    }
  }
}

/* Search Function */
async function handleSearch(query, limit, offset){
  try {
    const books = Book.findAndCountAll({
      limit: limit,
      offset: offset,
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: '%' + query + '%'
            }
          },
          {
            author: {
              [Op.like]: '%' + query + '%'
            }
          },
          {
            genre: {
              [Op.like]: '%' + query + '%'
            }
          },
          {
            year: {
              [Op.like]: '%' + query + '%'
            }
          },
        ]
      }
    });
    return books;
  } catch (error) {
    throw error;
  }
}

// Limit searches to 10 results
router.use(paginate.middleware(10, 10));


/* GET books listing. */
router.get('/', asyncHandler(async (req, res,) => {
  const books = await Book.findAndCountAll({limit: req.query.limit, offset: req.skip});
  const itemCount = books.count;
  const pageCount = Math.ceil(itemCount / req.query.limit);
  res.render('index', {
    books: books.rows,
    title: "Library",
    itemCount,
    pageCount,
    pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
  });
}));

/* SEARCH route */
router.get('/search', asyncHandler(async (req, res) => {
  const query = req.query.query;
  const books = await handleSearch(query, req.query.limit, req.skip);
  const itemCount = books.count;
  const pageCount = Math.ceil(itemCount / req.query.limit);
  res.render('index', {
    books: books.rows,
    title: "Library",
    query,
    itemCount,
    pageCount,
    pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
  });
}));

/* GET create new book form. */
router.get('/new', (req, res,) => {
  res.render('new-book', { book: {}, title: 'New Book' });
});

/* POST new book form. */
router.post('/new', asyncHandler(async(req, res,) => {
    const book = await Book.create(req.body);
    res.redirect('/');
}));

/* GET book details form. */
router.get('/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book !== null){
    res.render('update-book', { book: book, title: book.title });
  } else {
    const err = new Error();
    err.message = 'Sorry! The book id you are requesting does not exist.'
    next(err);
  }
}));

/* POST update book details. */
router.post('/:id', asyncHandler(async (req, res,) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/');
}));

/* POST delete book. */
router.post('/:id/delete', asyncHandler(async (req, res,) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/');
}));


module.exports = router;