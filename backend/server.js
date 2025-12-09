const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// Simple get endpoint
app.get('/', (req, res) => {
  res.send('THROUGHOUT HEAVEN AND EARTH, I ALONE AM THE HONOURED ONE');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
 .then(() => console.log('Connected to MongoDB'))
 .catch((err) => console.error('Error connecting to MongoDB:', err));

 // Server listen on port 3000
 app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));