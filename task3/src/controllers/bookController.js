const { bookSchema } = require('../utils/validationSchema');

let books = [];
let currentId = 1;

const getAllBooks = (req, res) => {
  res.json(books);
};

const searchBooks = (req, res) => {
  res.send('You are on the search page');
};

const getBookById = (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  res.json(book);
};

const createBook = (req, res) => {
  const { error, value } = bookSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  const newBook = {
    id: currentId++,
    ...value
  };
  
  books.push(newBook);
  res.status(201).json(newBook);
};

const deleteBook = (req, res) => {
  const bookId = parseInt(req.params.id);
  const initialLength = books.length;
  
  books = books.filter(book => book.id !== bookId);
  
  if (books.length === initialLength) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  res.json({ message: 'Book deleted successfully' });
};

module.exports = {
  getAllBooks,
  searchBooks,
  getBookById,
  createBook,
  deleteBook
};
