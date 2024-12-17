const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// API Endpoint to Get Random Quote
app.get('/api/quote', (req, res) => {
  const query = 'SELECT * FROM quotes ORDER BY RAND() LIMIT 1';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json({ quote: result[0].text });
  });
});

// API Endpoint to Submit a New Quote
app.post('/api/submit', (req, res) => {
  const { quote } = req.body;
  const query = 'INSERT INTO user_quotes (quote) VALUES (?)';
  db.query(query, [quote], (err, result) => {
    if (err) {
      res.json({ success: false });
      throw err;
    }
    res.json({ success: true });
  });
});

// API Endpoint to Get All Submitted Quotes
app.get('/api/quotes', (req, res) => {
  const query = 'SELECT * FROM user_quotes';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json({ quotes: result });
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
