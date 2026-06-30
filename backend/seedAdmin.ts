import 'dotenv/config';
import mongoose from 'mongoose';
import User from './src/modules/auth/user.model';
import { config } from './src/config/env';

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('Connected!');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'adminpassword123';

    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
    } else {
      console.log('Creating initial admin user...');
      const admin = new User({
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true,
      });

      await admin.save();
      console.log('Admin user created successfully!');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedAdmin();
