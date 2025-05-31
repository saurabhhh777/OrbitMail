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



const emailSentReceiveModel = mongoose.model("EmailInbox", emailSentReceiveSchema);
export default emailSentReceiveModel;
