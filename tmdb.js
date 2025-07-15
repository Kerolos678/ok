export default async (req, res) => {
  const { type } = req.query;
  const url = `https://api.themoviedb.org/3/${type}?api_key=200e5122c720ccc9a60c92a9a3b66f1e`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
