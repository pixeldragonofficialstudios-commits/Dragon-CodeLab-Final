// 1. Import required packages
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config(); // This loads the variables from .env

// 2. Set up the Express app
const app = express();
const port = 3000;

// 3. Add middleware
app.use(express.json());
app.use(express.static('.'));

// 4. Create the secure endpoint for AI BUILD
app.post('/api/generate', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured on the server.' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from Google API (Build):", errorData);
      return res.status(response.status).json({ error: 'Failed to fetch from Google AI API', details: errorData });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Proxy server error (Build):', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// 5. NEW: Create the secure endpoint for AI CHAT
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured on the server.' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from Google API (Chat):", errorData);
      return res.status(response.status).json({ error: 'Failed to fetch from Google AI API', details: errorData });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Proxy server error (Chat):', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// 6. Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('Open this URL in your browser to use the application.');
});