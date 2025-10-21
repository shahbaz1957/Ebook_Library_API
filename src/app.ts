import express from 'express';

const app = express();

// Middleware
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('Ebook Library API is running!');
});

export default app;
