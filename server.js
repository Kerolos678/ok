const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
const TMDB_API_KEY = '200e5122c720ccc9a60c92a9a3b66f1e';

app.get('/tmdb', async (req, res) => {
  try {
    const { type } = req.query;
    const response = await axios.get(`https://api.themoviedb.org/3/${type}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'ar-AR',
        ...req.query
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
