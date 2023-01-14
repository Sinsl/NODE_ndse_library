const express = require('express');
const app = express();
const redis = require('redis');

const PORT = process.env.PORT || 3001;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost'

const client = redis.createClient({ url: REDIS_URL });

(async () => {
  await client.connect();
})();

app.get('/counter/:bookId', async (req, res) => {

  const { bookId } = req.params
  const cnt = await client.get(bookId);
  res.json({count: cnt});
})

app.post('/counter/:bookId/incr', async (req, res) => {
  const { bookId } = req.params;
  const cnt = await client.incr(bookId);
  res.json({message: `Для: ${bookId}, установлен cnt ${cnt}`});
})

app.listen(PORT, () => {
  console.log(`Сервер слушает на порту ${PORT}`);
})
