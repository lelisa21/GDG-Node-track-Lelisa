const express = require('express');
const bookRoutes = require('./routes/bookRoutes');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());


app.use('/books', bookRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Bookstore API is running',
    endpoints: [
      'GET /books',
      'GET /books/search',
      'GET /books/:id',
      'POST /books',
      'DELETE /books/:id'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.use((req, res) => {
  res.status(404).json({ error: `Endpoint ${req.method} ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
