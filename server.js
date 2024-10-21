const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Enable JSON request body parsing

app.get('/', (req, res) => {
  res.send('Warehouse System Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});