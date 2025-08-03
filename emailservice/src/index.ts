import { EmailData, DomainConfig, EmailJob, QueueStats } from './types';
import { CustomSMTPClient } from './smtp/client';
import { DNSResolver } from './dns/resolver';
import { EmailQueue } from './queue/email-queue';

export class OrbitMailEmailService {
  private emailQueue: EmailQueue;
  private dnsResolver: DNSResolver;
  private domainConfigs: Map<string, DomainConfig> = new Map();

  constructor() {
    this.emailQueue = new EmailQueue();
    this.dnsResolver = new DNSResolver();
  }

  /**
   * Add domain configuration
   */
  async addDomain(domain: string, mxRecords: string[]): Promise<void> {
    // Verify domain has proper email configuration
    const isValid = await this.dnsResolver.verifyDomainEmailConfig(domain);
    
    if (!isValid) {
      throw new Error(`Domain ${domain} does not have proper email configuration`);
    }

    // Get complete DNS resolution
    const resolution = await this.dnsResolver.resolveDomain(domain);

    const domainConfig: DomainConfig = {
      domain,
      mxRecords,
      smtpConfig: {
        host: resolution.mxRecords[0]?.exchange || '',
        port: 25,
        secure: false,
        domain
      },
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.domainConfigs.set(domain, domainConfig);
    console.log(`Domain ${domain} added successfully`);
  }

  /**
   * Remove domain configuration
   */
  removeDomain(domain: string): boolean {
    return this.domainConfigs.delete(domain);
  }

  /**
   * Get domain configuration
   */
  getDomainConfig(domain: string): DomainConfig | null {
    return this.domainConfigs.get(domain) || null;
  }

  /**
   * List all domains
   */
  getAllDomains(): string[] {
    return Array.from(this.domainConfigs.keys());
  }

  /**
   * Send email from custom domain
   */
  async sendFromDomain(from: string, to: string, subject: string, text: string): Promise<string> {
    // Validate email format
    if (!this.dnsResolver.validateEmailFormat(from)) {
      throw new Error('Invalid sender email format');
    }

    if (!this.dnsResolver.validateEmailFormat(to)) {
      throw new Error('Invalid recipient email format');
    }

    // Extract domain from sender email
    const domain = this.dnsResolver.extractDomain(from);
    
    // Get domain configuration
    const domainConfig = this.getDomainConfig(domain);
    if (!domainConfig) {
      throw new Error(`Domain ${domain} not configured`);
    }

    if (!domainConfig.isVerified) {
      throw new Error(`Domain ${domain} not verified`);
    }

    // Create email data
    const emailData: EmailData = {
      from,
      to,
      subject,
      text
    };

    // Add to queue for processing
    const jobId = await this.emailQueue.addToQueue(emailData, domainConfig);
    
    console.log(`Email queued for sending: ${jobId}`);
    return jobId;
  }

  /**
   * Send email immediately (synchronous)
   */
  async sendEmailImmediate(from: string, to: string, subject: string, text: string): Promise<void> {
    // Validate email format
    if (!this.dnsResolver.validateEmailFormat(from)) {
      throw new Error('Invalid sender email format');
    }

    if (!this.dnsResolver.validateEmailFormat(to)) {
      throw new Error('Invalid recipient email format');
    }

    // Extract domain from sender email
    const domain = this.dnsResolver.extractDomain(from);
    
    // Get domain configuration
    const domainConfig = this.getDomainConfig(domain);
    if (!domainConfig) {
      throw new Error(`Domain ${domain} not configured`);
    }

    if (!domainConfig.isVerified) {
      throw new Error(`Domain ${domain} not verified`);
    }

    // Get MX server
    const mxServer = await this.dnsResolver.getBestMXServer(domain);
    if (!mxServer) {
      throw new Error(`No MX server found for domain: ${domain}`);
    }

    // Send email immediately
    const smtpClient = new CustomSMTPClient();
    await smtpClient.sendEmailWithConnection(
      mxServer,
      25,
      false,
      null,
      { from, to, subject, text }
    );

    console.log(`Email sent immediately from ${from} to ${to}`);
  }

  /**
   * Get job status
   */
  getJobStatus(jobId: string): EmailJob | null {
    return this.emailQueue.getJob(jobId);
  }

  /**
   * Get queue statistics
   */
  getQueueStats(): QueueStats {
    return this.emailQueue.getQueueStats();
  }

  /**
   * Get all jobs
   */
  getAllJobs(): EmailJob[] {
    return this.emailQueue.getAllJobs();
  }

  /**
   * Get jobs by status
   */
  getJobsByStatus(status: EmailJob['status']): EmailJob[] {
    return this.emailQueue.getJobsByStatus(status);
  }

  /**
   * Clear completed jobs
   */
  clearCompletedJobs(): number {
    return this.emailQueue.clearCompletedJobs();
  }

  /**
   * Retry failed jobs
   */
  retryFailedJobs(): number {
    return this.emailQueue.retryFailedJobs();
  }

  /**
   * Verify domain email configuration
   */
  async verifyDomain(domain: string): Promise<boolean> {
    try {
      const isValid = await this.dnsResolver.verifyDomainEmailConfig(domain);
      
      if (isValid) {
        const domainConfig = this.getDomainConfig(domain);
        if (domainConfig) {
          domainConfig.isVerified = true;
          domainConfig.updatedAt = new Date();
        }
      }
      
      return isValid;
    } catch (error) {
      console.error(`Domain verification failed for ${domain}:`, error);
      return false;
    }
  }

  /**
   * Get domain DNS information
   */
  async getDomainDNSInfo(domain: string) {
    return await this.dnsResolver.resolveDomain(domain);
  }

  /**
   * Test email sending for a domain
   */
  async testDomainEmail(domain: string, testEmail: string): Promise<boolean> {
    try {
      const domainConfig = this.getDomainConfig(domain);
      if (!domainConfig) {
        throw new Error(`Domain ${domain} not configured`);
      }

      // Send test email
      await this.sendEmailImmediate(
        `test@${domain}`,
        testEmail,
        'Test Email from OrbitMail',
        'This is a test email to verify domain configuration.'
      );

      return true;
    } catch (error) {
      console.error(`Domain email test failed for ${domain}:`, error);
      return false;
    }
  }

  /**
   * Stop the email service
   */
  stop(): void {
    this.emailQueue.stopProcessing();
    console.log('Email service stopped');
  }

  /**
   * Get service status
   */
  getStatus(): {
    domains: number;
    queueSize: number;
    isProcessing: boolean;
    queueStats: QueueStats;
  } {
    return {
      domains: this.domainConfigs.size,
      queueSize: this.emailQueue.getQueueSize(),
      isProcessing: this.emailQueue.isProcessing(),
      queueStats: this.emailQueue.getQueueStats()
    };
  }
}

// Export individual components for direct use
export { CustomSMTPClient } from './smtp/client';
export { DNSResolver } from './dns/resolver';
export { EmailQueue } from './queue/email-queue';
export * from './types'; 