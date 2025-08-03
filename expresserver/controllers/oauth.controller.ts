import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model';

// Google OAuth
export const googleAuth = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({
                message: "Authorization code is required",
                success: false
            });
        }

        // Exchange code for tokens
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code'
        });

        const { access_token } = tokenResponse.data as { access_token: string };

        // Get user info
        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const { id, email, name, picture } = userResponse.data as {
            id: string;
            email: string;
            name: string;
            picture: string;
        };

        // Find or create user
        let user = await userModel.findOne({ 
            authProvider: 'google', 
            authProviderId: id 
        });

        if (!user) {
            user = new userModel({
                email,
                name,
                avatar: picture,
                authProvider: 'google',
                authProviderId: id,
                isEmailVerified: true
            });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '30d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Google authentication successful",
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Google auth error:', error);
        return res.status(500).json({
            message: "Google authentication failed",
            success: false
        });
    }
};

// GitHub OAuth
export const githubAuth = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({
                message: "Authorization code is required",
                success: false
            });
        }

        // Exchange code for tokens
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        }, {
            headers: { Accept: 'application/json' }
        });

        const { access_token } = tokenResponse.data as { access_token: string };

        // Get user info
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const { id, login, avatar_url } = userResponse.data as {
            id: number;
            login: string;
            avatar_url: string;
        };

        // Get user email
        const emailResponse = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const emails = emailResponse.data as Array<{ email: string; primary: boolean }>;
        const primaryEmail = emails.find((email) => email.primary)?.email;

        // Find or create user
        let user = await userModel.findOne({ 
            authProvider: 'github', 
            authProviderId: id.toString()
        });

        if (!user) {
            user = new userModel({
                email: primaryEmail,
                name: login,
                avatar: avatar_url,
                authProvider: 'github',
                authProviderId: id.toString(),
                isEmailVerified: true
            });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '30d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "GitHub authentication successful",
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('GitHub auth error:', error);
        return res.status(500).json({
            message: "GitHub authentication failed",
            success: false
        });
    }
};

// Apple OAuth
export const appleAuth = async (req: Request, res: Response) => {
    try {
        const { code, id_token } = req.body;
        
        if (!code || !id_token) {
            return res.status(400).json({
                message: "Authorization code and ID token are required",
                success: false
            });
        }

        // Verify Apple ID token (simplified - in production, verify with Apple's servers)
        // For now, we'll trust the client-provided data
        
        // Find or create user based on Apple ID
        let user = await userModel.findOne({ 
            authProvider: 'apple', 
            authProviderId: req.body.user_id || 'apple_user'
        });

        if (!user) {
            user = new userModel({
                email: req.body.email,
                name: req.body.name || 'Apple User',
                authProvider: 'apple',
                authProviderId: req.body.user_id || 'apple_user',
                isEmailVerified: true
            });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '30d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Apple authentication successful",
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Apple auth error:', error);
        return res.status(500).json({
            message: "Apple authentication failed",
            success: false
        });
    }
}; 