const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/orbitmail', {
    dbName: 'orbitmail_db'
});

// Define User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    avatar: {
        type: String,
        required: false,
    },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'github', 'apple'],
        default: 'local'
    },
    authProviderId: {
        type: String,
        required: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    subscription: {
        plan: {
            type: String,
            enum: ['free', 'basic', 'premium'],
            default: 'free'
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'cancelled'],
            default: 'active'
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date,
            required: false
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);

async function checkAndCreateUser() {
    try {
        console.log('Checking for user: jack@gmail.com');
        
        // Check if user exists
        const existingUser = await User.findOne({ email: 'jack@gmail.com' });
        
        if (existingUser) {
            console.log('User found:', {
                id: existingUser._id,
                email: existingUser.email,
                hasPassword: !!existingUser.password
            });
        } else {
            console.log('User not found. Creating new user...');
            
            // Create new user
            const hashedPassword = bcrypt.hashSync('jack', 10);
            const newUser = new User({
                email: 'jack@gmail.com',
                password: hashedPassword,
                name: 'Jack',
                authProvider: 'local'
            });
            
            await newUser.save();
            console.log('User created successfully:', {
                id: newUser._id,
                email: newUser.email
            });
        }
        
        // List all users
        const allUsers = await User.find({});
        console.log('\nAll users in database:');
        allUsers.forEach(user => {
            console.log(`- ${user.email} (ID: ${user._id})`);
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
}

checkAndCreateUser(); 