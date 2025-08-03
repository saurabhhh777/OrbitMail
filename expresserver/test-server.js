const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(3000, () => {
  console.log('Test server running on port 3000');
}); 