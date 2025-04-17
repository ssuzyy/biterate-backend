const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // For cookies/auth
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
const db = require('./models');

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/badges', require('./routes/badge.routes'));

// Simple routes for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BiteRate API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Set port and start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Sync database (in development)
// db.sequelize.sync()
//   .then(() => {
//     console.log('Database synced');
//   })
//   .catch((err) => {
//     console.log('Failed to sync database: ' + err.message);
//   });