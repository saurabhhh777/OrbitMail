
import mongoose from 'mongoose';

const connectDB = async()=>{
    try {
        const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/orbitmail';
        
        await mongoose.connect(mongoUrl, {
            // Use a simpler database name to avoid namespace issues
            dbName: 'orbitmail_db'
        });
        
        console.log("MongoDB connected successfully");
        
    } catch (error) {
        console.log('Error connecting to the database:', error);
        process.exit(1);
    }
}

export default connectDB;