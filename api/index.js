import express from 'express';

// Create the api
const api = express();

api.get('/test', (req, res) => {
  res.json({ message: 'Testing' })
})

// Export the api
export default api;
