const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Define admin schema (same as admin.model.ts)
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

async function createAdmin() {
    try {
        // Connect to MongoDB with correct database name
        const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/orbitmail';
        await mongoose.connect(mongoUrl, {
            dbName: 'orbitmail_db'
        });
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@orbitmail.com' });
        
        if (existingAdmin) {
            console.log('Admin account already exists');
            process.exit(0);
        }

        // Create admin account
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const newAdmin = new Admin({
            name: 'OrbitMail Admin',
            email: 'admin@orbitmail.com',
            password: hashedPassword
        });

        await newAdmin.save();
        console.log('✅ Admin account created successfully!');
        console.log('📧 Email: admin@orbitmail.com');
        console.log('🔑 Password: admin123');
        console.log('⚠️  Please change the password after first login');

    } catch (error) {
        console.error('❌ Error creating admin account:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createAdmin(); 