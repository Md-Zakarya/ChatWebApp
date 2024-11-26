// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const setupSocket = require('./config/socket');
const connectDB = require('./config/db');
// Remove body-parser if not needed elsewhere
// const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = setupSocket(httpServer);

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' })); // Increased limit
app.use(express.urlencoded({ limit: '20mb', extended: true })); // Increased limit

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Routes
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const friendRoutes = require('./routes/friendRoutes');
const userRoutes = require('./routes/userRoutes'); 

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

// Connect to database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });