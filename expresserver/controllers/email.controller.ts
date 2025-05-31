import { Request, response, Response } from 'express';
import emailSentReceiveModel from '../models/emailSentReceive.model';
import userDomainModel from '../models/userDomain.model';


interface MailRequestBody {
  to: string;
  subject: string;
  text: string;
}



interface MailResponseBody {
    message:string;
    success:boolean;
    emailDetails?: {
        to: string;
        subject: string;
        text: string;
    }

}

interface GetMailResponseBody {
    message: string;
    success: boolean;
    emails?: Array<{
        id: string;
        to: string;
        from: string;
        subject: string;
        text: string;
        timestamp: Date;
        type: 'sent' | 'received';
    }>;
}


export const addDomain = (req:Request,res:Response):Promise<any>=>{
    try {
        const {domain} = req.body;
        if (!domain) {
            return res.status(400).json({
                message: "Prefix and domain are required",
                success: false,
            });
        }    

        const userId = req.user; // Assuming user ID is set in the request by userAuth middleware
        if  (!userId) {
            return res.status(401).json({
                message: "Unauthorized, please login",
                success: false,
            });
        }

        const saveEamil = new userDomainModel({
            domain: domain,
            userId: userId // Assuming req.user contains the user ID from authentication middleware
        });


        if(!saveEamil){
            return res.status(400).json({
                message: "Domain not saved",
                success: false,
            });
        }

        saveEamil.save()
            .then(() => {
                return res.status(200).json({
                    message: "Domain saved successfully",
                    success: true,
                });
            })
            .catch((error) => {
                console.error("Error saving domain:", error);
                return res.status(500).json({
                    message: "Internal Server Error",
                    success: false,
                });
            });


        


        
    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}





//This will sendEmail to the other person 
export const sendEmail = (req:Request<{}, {}, MailRequestBody>,res:Response<MailResponseBody>):Promise<any>=>{
    try {

        const { to, subject, text, } = req.body;

        if (!to) {
            return res.status(400).json({
                message: "To, subject, and text are required",
                success: false,
            });
        }

        

        return res.status(200).json({
            message: "Email sent successfully",
            success: true,
            emailDetails: {
                to,
                subject,
                text,
            },
        });

        
    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }

}


//will sent all the email on the base of the namme to the frotend 
export const getMail = async (req: Request, res: Response<GetMailResponseBody>):Promise<any> => {
    try {
        const userEmail = req.body.email;

        if (!userEmail) {
            return res.status(400).json({
                message: "Email is required",
                success: false
            });
        }

        // Find all emails where the user is either sender or receiver
        const emails = await emailSentReceiveModel.find({
            $or: [
                { from: userEmail },
                { to: userEmail }
            ]
        }).sort({ timestamp: -1 }); // Sort by timestamp in descending order (newest first)

        if(!emails){
            return res.status(200).json({
                message:"No Mail found",
                success:false,
                
            });
        }

        // Transform the data to include type (sent/received)
        const formattedEmails = emails.map(email => ({
            id: email._id.toString(),
            to: email.to,
            from: email.from,
            subject: email.subject,
            text: email.text,
            timestamp: email.createdAt,
            type: (email.from === userEmail ? 'sent' : 'received') as 'sent' | 'received'
        }));

        return res.status(200).json({
            message: "Emails retrieved successfully",
            success: true,
            emails: formattedEmails
        });
        
    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}