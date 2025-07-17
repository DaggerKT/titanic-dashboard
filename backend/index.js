import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'titanic',
  password: process.env.PGPASSWORD || 'postgres',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

// Create table if not exists
pool.query(`CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  card_key VARCHAR(50) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

// Get comments by cardKey
app.get('/api/comments/:cardKey', async (req, res) => {
  try {
    const { cardKey } = req.params;
    const result = await pool.query('SELECT * FROM comments WHERE card_key = $1 ORDER BY created_at ASC', [cardKey]);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/comments/:cardKey', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add comment
app.post('/api/comments/:cardKey', async (req, res) => {
  try {
    const { cardKey } = req.params;
    const { text } = req.body;
    const result = await pool.query('INSERT INTO comments (card_key, text) VALUES ($1, $2) RETURNING *', [cardKey, text]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/comments/:cardKey', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit comment
app.put('/api/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const result = await pool.query('UPDATE comments SET text = $1 WHERE id = $2 RETURNING *', [text, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /api/comments/:id', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete comment
app.delete('/api/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM comments WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/comments/:id', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
