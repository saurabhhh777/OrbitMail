import * as net from 'net';
import * as tls from 'tls';
import { SMTPError, SMTPConnection, SMTPResponse, EmailData } from '../types';

export class CustomSMTPClient {
  private connection: SMTPConnection | null = null;
  private timeout: number = 30000; // 30 seconds

  /**
   * Connect to SMTP server
   */
  async connect(host: string, port: number, secure: boolean = false): Promise<SMTPConnection> {
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
        reject(new SMTPError(`Connection failed: ${error.message}`, 0));
      });

      socket.on('timeout', () => {
        socket.destroy();
        reject(new SMTPError('Connection timeout', 0));
      });
    });
  }

  /**
   * Send SMTP command and wait for response
   */
  private async sendCommand(command: string): Promise<SMTPResponse> {
    if (!this.connection) {
      throw new SMTPError('Not connected to SMTP server', 0);
    }

    return new Promise((resolve, reject) => {
      if (!this.connection) {
        reject(new SMTPError('Not connected to SMTP server', 0));
        return;
      }
      const { socket } = this.connection;

      const timeout = setTimeout(() => {
        reject(new SMTPError('Command timeout', 0));
      }, this.timeout);

      const dataHandler = (data: Buffer) => {
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
        } else {
          reject(new SMTPError(message, code));
        }
      };

      socket.on('data', dataHandler);
      socket.write(command + '\r\n');
    });
  }

  /**
   * Authenticate with SMTP server
   */
  async authenticate(username: string, password: string): Promise<void> {
    if (!this.connection) {
      throw new SMTPError('Not connected to SMTP server', 0);
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
    } catch (error: any) {
      throw new SMTPError(`Authentication failed: ${error.message}`, 535);
    }
  }

  /**
   * Send email via SMTP
   */
  async sendEmail(email: EmailData): Promise<void> {
    if (!this.connection) {
      throw new SMTPError('Not connected to SMTP server', 0);
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
    } catch (error: any) {
      throw new SMTPError(`Failed to send email: ${error.message}`, 550);
    }
  }

  /**
   * Format email content according to RFC 5322
   */
  private formatEmailContent(email: EmailData): string {
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
  private generateMessageId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}.${random}@${this.connection?.host || 'localhost'}`;
  }

  /**
   * Disconnect from SMTP server
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      this.connection.socket.destroy();
      this.connection = null;
      console.log('Disconnected from SMTP server');
    }
  }

  /**
   * Send email with automatic connection management
   */
  async sendEmailWithConnection(
    host: string, 
    port: number, 
    secure: boolean,
    auth: { username: string; password: string } | null,
    email: EmailData
  ): Promise<void> {
    try {
      // Connect to SMTP server
      await this.connect(host, port, secure);

      // Authenticate if credentials provided
      if (auth) {
        await this.authenticate(auth.username, auth.password);
      }

      // Send email
      await this.sendEmail(email);
    } finally {
      // Always disconnect
      await this.disconnect();
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection !== null;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): { connected: boolean; authenticated: boolean } {
    return {
      connected: this.connection !== null,
      authenticated: this.connection?.authenticated || false
    };
  }
} 