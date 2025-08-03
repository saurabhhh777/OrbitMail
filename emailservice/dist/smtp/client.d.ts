import { SMTPConnection, EmailData } from '../types';
export declare class CustomSMTPClient {
    private connection;
    private timeout;
    /**
     * Connect to SMTP server
     */
    connect(host: string, port: number, secure?: boolean): Promise<SMTPConnection>;
    /**
     * Send SMTP command and wait for response
     */
    private sendCommand;
    /**
     * Authenticate with SMTP server
     */
    authenticate(username: string, password: string): Promise<void>;
    /**
     * Send email via SMTP
     */
    sendEmail(email: EmailData): Promise<void>;
    /**
     * Format email content according to RFC 5322
     */
    private formatEmailContent;
    /**
     * Generate unique message ID
     */
    private generateMessageId;
    /**
     * Disconnect from SMTP server
     */
    disconnect(): Promise<void>;
    /**
     * Send email with automatic connection management
     */
    sendEmailWithConnection(host: string, port: number, secure: boolean, auth: {
        username: string;
        password: string;
    } | null, email: EmailData): Promise<void>;
    /**
     * Check if connected
     */
    isConnected(): boolean;
    /**
     * Get connection status
     */
    getConnectionStatus(): {
        connected: boolean;
        authenticated: boolean;
    };
}
//# sourceMappingURL=client.d.ts.map