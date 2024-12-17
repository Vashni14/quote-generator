const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
  console.log('MySQL connected...');
});

// API Endpoint to Get Random Quote
app.get('/api/quote', (req, res) => {
  const query = 'SELECT * FROM quotes ORDER BY RAND() LIMIT 1';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching random quote:', err);
      return res.status(500).json({ error: 'Failed to fetch quote' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'No quotes found' });
    }
    res.json({ quote: result[0].text, id: result[0].id });
  });
});

// API Endpoint to Submit a Quote
app.post('/api/submit', (req, res) => {
  const { quote } = req.body;

  if (!quote || quote.trim() === '') {
    return res.status(400).json({ success: false, error: 'Quote cannot be empty' });
  }

  const query = 'INSERT INTO user_quotes (quote) VALUES (?)';
  db.query(query, [quote], (err, result) => {
    if (err) {
      console.error('Error inserting quote:', err);
      return res.status(500).json({ success: false, error: 'Failed to submit quote' });
    }
    res.json({ success: true });
  });
});

// API Endpoint to View Submitted Quotes (User-Submitted)
app.get('/api/quotes', (req, res) => {
  const query = 'SELECT * FROM user_quotes';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching submitted quotes:', err);
      return res.status(500).json({ error: 'Failed to fetch submitted quotes' });
    }
    res.json({ quotes: result });
  });
});

// API Endpoint to Add a Quote to Favourites
app.post('/api/favourite', (req, res) => {
  const { quote_id } = req.body;

  if (!quote_id) {
    return res.status(400).json({ success: false, error: 'Quote ID is required' });
  }

  const query = 'INSERT INTO favourites (quote_id) VALUES (?)';
  db.query(query, [quote_id], (err, result) => {
    if (err) {
      console.error('Error adding to favourites:', err);
      return res.status(500).json({ success: false, error: 'Failed to add to favourites' });
    }
    res.json({ success: true });
  });
});

// API Endpoint to Get Favourites
app.get('/api/favourites', (req, res) => {
  const query = `
    SELECT q.text FROM favourites f
    JOIN quotes q ON f.quote_id = q.id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching favourites:', err);
      return res.status(500).json({ error: 'Failed to fetch favourites' });
    }
    res.json({ favourites: results });
  });
});

// Start the Server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
