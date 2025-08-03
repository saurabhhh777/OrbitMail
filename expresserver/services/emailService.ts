// Simple email service manager for testing
class EmailServiceManager {
  private static instance: EmailServiceManager;

  private constructor() {
    console.log('Email Service Manager initialized');
  }

  public static getInstance(): EmailServiceManager {
    if (!EmailServiceManager.instance) {
      EmailServiceManager.instance = new EmailServiceManager();
    }
    return EmailServiceManager.instance;
  }

  // Helper methods for common operations
  public async sendEmail(from: string, to: string, subject: string, text: string): Promise<string> {
    try {
      console.log(`Sending email from ${from} to ${to}: ${subject}`);
      // Simulate email sending
      return 'test-job-id';
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }

  public async addDomain(domain: string, mxRecords: string[]): Promise<void> {
    try {
      console.log(`Adding domain: ${domain} with MX records:`, mxRecords);
    } catch (error) {
      console.error('Domain addition error:', error);
      throw error;
    }
  }

  public async verifyDomain(domain: string): Promise<boolean> {
    try {
      console.log(`Verifying domain: ${domain}`);
      return true;
    } catch (error) {
      console.error('Domain verification error:', error);
      throw error;
    }
  }

  public getStatus() {
    return {
      domains: 0,
      queueSize: 0,
      isProcessing: false,
      queueStats: {
        total: 0,
        pending: 0,
        processing: 0,
        sent: 0,
        failed: 0,
        retry: 0
      }
    };
  }

  public getQueueStats() {
    return {
      total: 0,
      pending: 0,
      processing: 0,
      sent: 0,
      failed: 0,
      retry: 0
    };
  }

  public getJobStatus(jobId: string) {
    return {
      id: jobId,
      status: 'sent',
      createdAt: new Date(),
      sentAt: new Date()
    };
  }
}

// Export singleton instance
export const emailServiceManager = EmailServiceManager.getInstance();
export default emailServiceManager; 