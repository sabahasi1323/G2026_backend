const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/machinery_maintenance', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create default users with properly hashed passwords
    const defaultUsers = [
      {
        name: 'Vetri Vel',
        email: 'vetrivelpg@gmail.com',
        phone: '+91 9488481323',
        password: '9488481323',
        role: 'admin',
        status: 'active',
        permissions: ['all']
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '+91 9876543210',
        password: 'admin123',
        role: 'admin',
        status: 'active',
        permissions: ['all']
      },
      {
        name: 'John Manager',
        email: 'manager@example.com',
        phone: '+91 9876543211',
        password: 'password123',
        role: 'manager',
        status: 'active',
        permissions: ['billing', 'customers', 'reports']
      },
      {
        name: 'Sarah Employee',
        email: 'employee@example.com',
        phone: '+91 9876543212',
        password: 'password123',
        role: 'employee',
        status: 'active',
        permissions: ['billing', 'customers']
      },
      {
        name: 'Mike Staff',
        email: 'staff@example.com',
        phone: '+91 9876543213',
        password: 'password123',
        role: 'staff',
        status: 'inactive',
        permissions: ['billing']
      }
    ];

    // Hash passwords before inserting
    const usersWithHashedPasswords = await Promise.all(
      defaultUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    // Insert users
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log('Created users:');
    createdUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role} - ${user.status}`);
    });

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedUsers();
