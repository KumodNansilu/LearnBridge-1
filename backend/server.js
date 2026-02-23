const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');

dotenv.config();

// Connect to Database (We will set the URI in the next step)
connectDB(); 

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // React app URL
  credentials: true
}));
app.use(express.json()); // Allows us to accept JSON data in the body

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
