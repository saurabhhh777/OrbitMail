
import mongoose from 'mongoose';

const connectDB = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`)
        .then(()=>{
            console.log("MongoDB connected successfully");
        });
        
    } catch (error) {
        console.log('Error connecting to the database:', error);
    }

}

export default connectDB;