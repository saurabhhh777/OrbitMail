import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import adminRouter from "./routes/admin.route";
import emailRouter from "./routes/email.route";
import userDomainRouter from "./routes/userDomain.route";
import connectDB from './config/db';


dotenv.config();

const app = express();

// Connect to the database
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



//user route 
app.use("/api/v1/user", userRouter);


//admin route
app.use("/api/v1/admin", adminRouter);


//email route 
app.use("/api/v1/email", emailRouter);


//userDomain Route 
app.use("/api/v1/userdomain", userDomainRouter);




const PORT = process.env.PORT || 3000;

app.listen(PORT , ()=>{
    console.log(`Express server is running on port ${PORT}`);
});