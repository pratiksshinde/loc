const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// Middleware to get client IP address
app.use((req, res, next) => {
  const forwarded = req.headers['x-forwarded-for'];
  req.clientIp = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;
  next();
});

app.get('/location', async (req, res) => {
  try {
    const ip = req.clientIp || '8.8.8.8'; // Use a default IP for testing
    console.log(`Client IP: ${ip}`);

    // Call an IP geolocation API (e.g., ip-api.com)
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    const locationData = response.data;

    res.json({
      ip: ip,
      location: locationData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
