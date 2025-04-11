require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Test route
app.get('/', (req, res) => {
  res.send('Server is running! Try /weather?city=London');
});

// Weather route
app.get('/weather', async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: 'City parameter is required' });

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    
    res.json({
      city: response.data.name,
      temp: response.data.main.temp,
      weather: response.data.weather[0].main,
      humidity: response.data.main.humidity
    });
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: error.response?.data?.message || 'Failed to fetch weather' 
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});