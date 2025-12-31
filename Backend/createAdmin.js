import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Admin from './src/models/admin.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const username = 'Admin02'; 
    const password = '123456'; 

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const admin = new Admin({
      username,
      password_hash,
      role: 'admin',
      centers: [],
      avatar: 'https://example.com/default-avatar.png'
    });

    await admin.save();
    console.log('Admin created successfully!');
    console.log('Username:', username);
    console.log('Password:', password);

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();