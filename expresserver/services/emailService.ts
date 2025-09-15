// Real email service manager using OrbitMail custom email service
import { OrbitMailEmailService } from 'orbitmail-emailservice';

class EmailServiceManager {
  private static instance: EmailServiceManager;
  private emailService: OrbitMailEmailService;

  private constructor() {
    this.emailService = new OrbitMailEmailService();
    console.log('Email Service Manager initialized with OrbitMail custom email service');
  }

  public static getInstance(): EmailServiceManager {
    if (!EmailServiceManager.instance) {
      EmailServiceManager.instance = new EmailServiceManager();
    }
    return EmailServiceManager.instance;
  }

  // Send email using OrbitMail custom email service
  public async sendEmail(from: string, to: string, subject: string, text: string): Promise<string> {
    try {
      console.log(`Sending email from ${from} to ${to}: ${subject}`);
      
      // Use the custom email service to send email
      const jobId = await this.emailService.sendFromDomain(from, to, subject, text);
      
      console.log(`Email queued successfully with job ID: ${jobId}`);
      return jobId;
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }

  public async addDomain(domain: string, mxRecords: string[]): Promise<void> {
    try {
      console.log(`Adding domain: ${domain} with MX records:`, mxRecords);
      await this.emailService.addDomain(domain, mxRecords);
    } catch (error) {
      console.error('Domain addition error:', error);
      throw error;
    }
  }

  public async verifyDomain(domain: string): Promise<boolean> {
    try {
      console.log(`Verifying domain: ${domain}`);
      return await this.emailService.verifyDomain(domain);
    } catch (error) {
      console.error('Domain verification error:', error);
      throw error;
    }
  }

  public getStatus() {
    return this.emailService.getQueueStats();
  }

  public getQueueStats() {
    return this.emailService.getQueueStats();
  }

  public getJobStatus(jobId: string) {
    return this.emailService.getJobStatus(jobId);
  }
}

// Export singleton instance
export const emailServiceManager = EmailServiceManager.getInstance();
export default emailServiceManager; 