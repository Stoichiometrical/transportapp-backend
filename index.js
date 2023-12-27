import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import dotenv from "dotenv"

dotenv.config()

const app = express();

const MONGO_URI = 'mongodb+srv://kg:12345@cluster0.qwmvo7p.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// MongoDB connection error handling
mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

// MongoDB connection success handling
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

// Middleware

app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/users', userRoutes);
app.use('/trips', tripRoutes);
app.get('/', (req, res) => {
    res.send('Server is awake!');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
