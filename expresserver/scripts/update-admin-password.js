const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Define admin schema
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

async function updateAdminPassword() {
    try {
        // Connect to MongoDB
        const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/orbitmail';
        await mongoose.connect(mongoUrl, {
            dbName: 'orbitmail_db'
        });
        console.log('Connected to MongoDB');

        // Generate new hash
        const password = 'saurabh';
        const newHash = bcrypt.hashSync(password, 10);
        
        console.log('Password:', password);
        console.log('New Hash:', newHash);

        // Update admin password
        const result = await Admin.updateOne(
            { email: 'saurabhhhere@gmail.com' },
            { password: newHash }
        );

        if (result.modifiedCount > 0) {
            console.log('✅ Admin password updated successfully!');
            console.log('📧 Email: saurabhhhere@gmail.com');
            console.log('🔑 Password: saurabh');
        } else {
            console.log('❌ Admin not found or password not updated');
        }

        // Verify the update
        const admin = await Admin.findOne({ email: 'saurabhhhere@gmail.com' });
        if (admin) {
            const isValid = bcrypt.compareSync(password, admin.password);
            console.log('✅ Password verification:', isValid);
        }

    } catch (error) {
        console.error('❌ Error updating admin password:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

updateAdminPassword(); 