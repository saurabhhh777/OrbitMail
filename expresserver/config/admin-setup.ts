import bcryptjs from 'bcryptjs';
import admin from '../models/admin.model';

export const setupAdminAccount = async () => {
    try {
        // Check if admin setup is enabled
        if (process.env.SETUP_ADMIN !== 'true') {
            console.log('Admin setup disabled. Set SETUP_ADMIN=true to enable.');
            return;
        }

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@orbitmail.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const adminName = process.env.ADMIN_NAME || 'OrbitMail Admin';

        // Check if admin already exists
        const existingAdmin = await admin.findOne({ email: adminEmail });
        
        if (existingAdmin) {
            console.log('Admin account already exists');
            return;
        }

        // Create admin account
        const hashedPassword = bcryptjs.hashSync(adminPassword, 10);
        
        const newAdmin = new admin({
            name: adminName,
            email: adminEmail,
            password: hashedPassword
        });

        await newAdmin.save();
        console.log('✅ Admin account created successfully!');
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${adminPassword}`);
        console.log('⚠️  Please change the password after first login');

    } catch (error) {
        console.error('❌ Error creating admin account:', error);
    }
}; 