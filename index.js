const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Replace with your Azure DB info:
const db = mysql.createPool({
  host: 'truck-db.mysql.database.azure.com',
  user: 'capuser@truck-db',
  password: process.env.DB_PASSWORD,
  database: 'food_trucks',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

// GET trucks
app.get('/trucks', (req, res) => {
  db.query('SELECT * FROM trucks', (err, results) => {
    if (err) {
      console.error("GET /trucks error:", err); // add this
      return res.status(500).send("DB error");
    }
    res.json(results);
  });
});

// POST truck
app.post('/trucks', (req, res) => {
  const { id, latitude, longitude } = req.body;
  db.query(
    'INSERT INTO trucks (id, latitude, longitude) VALUES (?, ?, ?)',
    [id, latitude, longitude],
    (err) => {
      if (err) {
        console.error("POST /trucks error:", err); // add this
        return res.status(500).send("DB error");
      }
      res.sendStatus(200);
    }
  );
});

// DELETE truck
app.delete('/trucks/:id', (req, res) => {
  db.query('DELETE FROM trucks WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      console.error("DELETE /trucks error:", err); // add this
      return res.status(500).send("DB error");
    }
    res.sendStatus(200);
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});