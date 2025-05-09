import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import applicationRoutes from './routes/applicationRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


app.use('/api', (req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('Request Body:', req.body);
  }
  next();
});
app.use('/api', applicationRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Loan Manager Backend is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
