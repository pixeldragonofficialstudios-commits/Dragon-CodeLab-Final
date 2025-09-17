// Filename: netlify/functions/api.js
// Use this code for Netlify.

// 1. Import required packages
const express = require('express');
const fetch = require('node-fetch');
const serverless = require('serverless-http'); // <-- Added for Netlify
require('dotenv').config();

// 2. Set up the Express app (Router is used for serverless context)
const app = express();
const router = express.Router();

// 3. Add middleware to the router
router.use(express.json());
// This tells Express to serve static files from the root of the project
router.use(express.static('../../')); // <-- Path adjustment for functions folder

// 4. Create the secure endpoint for AI BUILD on the router
router.post('/generate', async (req, res) => {
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

// 5. Create the secure endpoint for AI CHAT on the router
router.post('/chat', async (req, res) => {
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

// 6. Prepare the app for Netlify
app.use('/api', router); // <-- All our routes are under /api now

// 7. Export the handler for Netlify to use
module.exports.handler = serverless(app);