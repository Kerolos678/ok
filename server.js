require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 3000;
const TMDB_API_KEY = process.env.TMDB_API_KEY || '200e5122c720ccc9a60c92a9a3b66f1e';

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'running',
    message: 'TMDB Proxy Service is operational'
  });
});

// Proxy endpoint
app.get('/tmdb', async (req, res) => {
  try {
    const { type } = req.query;
    
    if (!type) {
      return res.status(400).json({ 
        error: 'Type parameter is required',
        example: '/tmdb?type=movie/popular'
      });
    }

    const response = await axios.get(`https://api.themoviedb.org/3/${type}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'ar-AR',
        ...req.query
      },
      timeout: 5000 // 5 seconds timeout
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Proxy Error:', error.message);
    
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.status_message || error.message;
    
    res.status(statusCode).json({ 
      error: 'Proxy Error',
      message: errorMessage,
      details: error.config?.url
    });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
