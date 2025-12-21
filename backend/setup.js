import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      username: 'admin',
      password: adminPassword,
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created');

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = new User({
      username: 'user1',
      password: userPassword,
      role: 'user'
    });
    await user.save();
    console.log('Regular user created');

    console.log('\nTest users created successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin User:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nRegular User:');
    console.log('Username: user1');
    console.log('Password: user123');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

createTestUsers(); 