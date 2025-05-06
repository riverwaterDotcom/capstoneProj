const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Replace with your Azure DB info:
const db = mysql.createConnection({
  host: 'truck-db.mysql.database.azure.com',
  user: 'capuser@truck-db.mysql.database.azure.com',
  password: 'projPass1!',
  database: 'food_trucks'
});

app.get('/trucks', (req, res) => {
  db.query('SELECT * FROM trucks', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/trucks', (req, res) => {
  const { id, latitude, longitude } = req.body;
  db.query(
    'INSERT INTO trucks (id, latitude, longitude) VALUES (?, ?, ?)',
    [id, latitude, longitude],
    (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    }
  );
});

app.delete('/trucks/:id', (req, res) => {
  db.query('DELETE FROM trucks WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});