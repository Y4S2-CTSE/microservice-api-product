const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/products', productRoutes);

// Only connect if not in test environment
if (process.env.NODE_ENV !== 'test') {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
  }

  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
      });
    })
    .catch((err) => {
      console.error('DB connection error:', err);
      process.exit(1);
    });
}

module.exports = app;
