// backend/seeders/adminSeeder.js
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const adminData = {
  username: 'admin123',
  email: 'admin123@example.com',
  password: 'admin123',
  role: 'admin'
};

const seedAdmin = async () => {
  try {
    console.log('Starting admin seeder...');
    
    await User.deleteOne({ email: adminData.email });
    
    // Create admin without double-hashing
    const newAdmin = await User.create({
      username: adminData.username,
      email: adminData.email,
      password: adminData.password, // Let the model's pre-save hook handle hashing
      role: adminData.role
    });

    // Verify using the original password
    const verifyPassword = await bcrypt.compare(adminData.password, newAdmin.password);
    console.log('Password verification:', verifyPassword); // Should now be true

    console.log('Admin created successfully:', {
      id: newAdmin._id,
      email: newAdmin.email,
      role: newAdmin.role
    });

  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};
module.exports = seedAdmin;