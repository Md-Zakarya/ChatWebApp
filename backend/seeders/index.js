// backend/seeders/index.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedAdmin = require('./adminSeeder');


dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    await seedAdmin();
   
    
    console.log('Seeding completed');
    process.exit();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });