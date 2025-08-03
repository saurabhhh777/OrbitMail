"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSMTPClient = void 0;
const net = __importStar(require("net"));
const tls = __importStar(require("tls"));
const types_1 = require("../types");
class CustomSMTPClient {
    constructor() {
        this.connection = null;
        this.timeout = 30000; // 30 seconds
    }
    /**
     * Connect to SMTP server
     */
    async connect(host, port, secure = false) {
        return new Promise((resolve, reject) => {
            const socket = secure
                ? tls.connect({ host, port, rejectUnauthorized: false })
                : net.connect({ host, port });
            socket.setTimeout(this.timeout);
            socket.on('connect', () => {
                console.log(`Connected to SMTP server: ${host}:${port}`);
                this.connection = {
                    socket,
                    host,
                    port,
                    secure,
                    authenticated: false
                };
                resolve(this.connection);
            });
            socket.on('error', (error) => {
                reject(new types_1.SMTPError(`Connection failed: ${error.message}`, 0));
            });
            socket.on('timeout', () => {
                socket.destroy();
                reject(new types_1.SMTPError('Connection timeout', 0));
            });
        });
    }
    /**
     * Send SMTP command and wait for response
     */
    async sendCommand(command) {
        if (!this.connection) {
            throw new types_1.SMTPError('Not connected to SMTP server', 0);
        }
        return new Promise((resolve, reject) => {
            if (!this.connection) {
                reject(new types_1.SMTPError('Not connected to SMTP server', 0));
                return;
            }
            const { socket } = this.connection;
            const timeout = setTimeout(() => {
                reject(new types_1.SMTPError('Command timeout', 0));
            }, this.timeout);
            const dataHandler = (data) => {
                const response = data.toString().trim();
                const lines = response.split('\r\n');
                const lastLine = lines[lines.length - 1];
                // Parse response code and message
                const code = parseInt(lastLine.substring(0, 3));
                const message = lastLine.substring(4);
                clearTimeout(timeout);
                socket.removeListener('data', dataHandler);
                if (code >= 200 && code < 400) {
                    resolve({ code, message });
                }
                else {
                    reject(new types_1.SMTPError(message, code));
                }
            };
            socket.on('data', dataHandler);
            socket.write(command + '\r\n');
        });
    }
    /**
     * Authenticate with SMTP server
     */
    async authenticate(username, password) {
        if (!this.connection) {
            throw new types_1.SMTPError('Not connected to SMTP server', 0);
        }
        try {
            // Send EHLO command
            await this.sendCommand(`EHLO ${this.connection.host}`);
            // Send AUTH LOGIN command
            await this.sendCommand('AUTH LOGIN');
            // Send username (base64 encoded)
            const encodedUsername = Buffer.from(username).toString('base64');
            await this.sendCommand(encodedUsername);
            // Send password (base64 encoded)
            const encodedPassword = Buffer.from(password).toString('base64');
            await this.sendCommand(encodedPassword);
            this.connection.authenticated = true;
            console.log('SMTP authentication successful');
        }
        catch (error) {
            throw new types_1.SMTPError(`Authentication failed: ${error.message}`, 535);
        }
    }
    /**
     * Send email via SMTP
     */
    async sendEmail(email) {
        if (!this.connection) {
            throw new types_1.SMTPError('Not connected to SMTP server', 0);
        }
        try {
            // Send MAIL FROM command
            await this.sendCommand(`MAIL FROM:<${email.from}>`);
            // Send RCPT TO command
            await this.sendCommand(`RCPT TO:<${email.to}>`);
            // Send DATA command
            await this.sendCommand('DATA');
            // Prepare email content
            const emailContent = this.formatEmailContent(email);
            // Send email content
            await this.sendCommand(emailContent);
            // Send QUIT command
            await this.sendCommand('QUIT');
            console.log('Email sent successfully');
        }
        catch (error) {
            throw new types_1.SMTPError(`Failed to send email: ${error.message}`, 550);
        }
    }
    /**
     * Format email content according to RFC 5322
     */
    formatEmailContent(email) {
        const headers = [
            `From: ${email.from}`,
            `To: ${email.to}`,
            `Subject: ${email.subject}`,
            `Date: ${new Date().toUTCString()}`,
            `Message-ID: <${this.generateMessageId()}>`,
            `MIME-Version: 1.0`,
            `Content-Type: text/plain; charset=UTF-8`,
            `Content-Transfer-Encoding: 7bit`,
            '',
            email.text,
            '',
            '.'
        ];
        return headers.join('\r\n');
    }
    /**
     * Generate unique message ID
     */
    generateMessageId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2);
        return `${timestamp}.${random}@${this.connection?.host || 'localhost'}`;
    }
    /**
     * Disconnect from SMTP server
     */
    async disconnect() {
        if (this.connection) {
            this.connection.socket.destroy();
            this.connection = null;
            console.log('Disconnected from SMTP server');
        }
    }
    /**
     * Send email with automatic connection management
     */
    async sendEmailWithConnection(host, port, secure, auth, email) {
        try {
            // Connect to SMTP server
            await this.connect(host, port, secure);
            // Authenticate if credentials provided
            if (auth) {
                await this.authenticate(auth.username, auth.password);
            }
            // Send email
            await this.sendEmail(email);
        }
        finally {
            // Always disconnect
            await this.disconnect();
        }
    }
    /**
     * Check if connected
     */
    isConnected() {
        return this.connection !== null;
    }
    /**
     * Get connection status
     */
    getConnectionStatus() {
        return {
            connected: this.connection !== null,
            authenticated: this.connection?.authenticated || false
        };
    }
}
exports.CustomSMTPClient = CustomSMTPClient;
//# sourceMappingURL=client.js.map