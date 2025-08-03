const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Admin model (same as in expresserver/models/admin.model.ts)
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/orbitmail');
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@orbitmail.com' });
        
        if (existingAdmin) {
            console.log('Admin account already exists');
            process.exit(0);
        }

        // Create admin account
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const admin = new Admin({
            name: 'OrbitMail Admin',
            email: 'admin@orbitmail.com',
            password: hashedPassword
        });

        await admin.save();
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