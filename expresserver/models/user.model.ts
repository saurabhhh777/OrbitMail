import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false, // Not required for OAuth users
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


const UserModel = mongoose.model("User", userSchema);
export default UserModel;