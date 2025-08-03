import mongoose from "mongoose";

const emailSentReceiveSchema = new mongoose.Schema({
    to:{
        type: String,
        required: true,
        default: ""
    },
    from:{
        type:String,
        required: true,
        default: "",
    },
    subject: {
        type: String,
        required: true,
        default: "",
    },
    text:{
        type: String,
        required: true,
        default: "",
    },
    html:{
        type: String,
        required: false,
        default: "",
    }
},{timestamps: true});

// Add indexes for better query performance
emailSentReceiveSchema.index({ to: 1, createdAt: -1 });
emailSentReceiveSchema.index({ from: 1, createdAt: -1 });
emailSentReceiveSchema.index({ createdAt: -1 });



const emailSentReceiveModel = mongoose.model("EmailSentReceive", emailSentReceiveSchema);
export default emailSentReceiveModel;
