// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { setupSocketIO } = require('./config/socket');

const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const seedAdmin = require('./seeders/adminSeeder');



dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = setupSocketIO(httpServer);

// Middleware
app.use(cors());
app.use(express.json());


// Routes
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const friendRoutes = require('./routes/friendRoutes');
const userRoutes = require('./routes/userRoutes'); 
app.use(express.json({ limit: '10mb' }));
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
dotenv.config();

// Root route handler
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ChatApp API' });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});




// Connect to database
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {  // Add async here
        console.log('Connected to MongoDB');
        await seedAdmin();
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Connection error', err);
    });