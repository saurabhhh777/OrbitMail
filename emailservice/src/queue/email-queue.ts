import { v4 as uuidv4 } from 'uuid';
import { EmailJob, EmailData, DomainConfig, QueueStats } from '../types';
import { CustomSMTPClient } from '../smtp/client';
import { DNSResolver } from '../dns/resolver';

export class EmailQueue {
  private queue: EmailJob[] = [];
  private processing: boolean = false;
  private maxRetries: number = 3;
  private retryDelay: number = 5000; // 5 seconds
  private processingInterval: number = 1000; // 1 second
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.startProcessing();
  }

  /**
   * Add email to queue
   */
  async addToQueue(email: EmailData, domainConfig: DomainConfig): Promise<string> {
    const job: EmailJob = {
      id: uuidv4(),
      email,
      domainConfig,
      status: 'pending',
      retries: 0,
      maxRetries: this.maxRetries,
      createdAt: new Date()
    };

    this.queue.push(job);
    console.log(`Email job ${job.id} added to queue`);

    return job.id;
  }

  /**
   * Start background processing
   */
  private startProcessing(): void {
    this.intervalId = setInterval(() => {
      this.processQueue();
    }, this.processingInterval);
  }

  /**
   * Stop background processing
   */
  stopProcessing(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Process email queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    try {
      const pendingJobs = this.queue.filter(job => 
        job.status === 'pending' || job.status === 'retry'
      );

      for (const job of pendingJobs) {
        await this.processJob(job);
      }
    } catch (error) {
      console.error('Error processing email queue:', error);
    } finally {
      this.processing = false;
    }
  }

  /**
   * Process individual email job
   */
  private async processJob(job: EmailJob): Promise<void> {
    try {
      console.log(`Processing email job ${job.id}`);

      // Update job status
      job.status = 'processing';

      // Get MX server for domain
      const dnsResolver = new DNSResolver();
      const mxServer = await dnsResolver.getBestMXServer(job.domainConfig.domain);

      if (!mxServer) {
        throw new Error(`No MX server found for domain: ${job.domainConfig.domain}`);
      }

      // Send email using SMTP client
      const smtpClient = new CustomSMTPClient();
      await smtpClient.sendEmailWithConnection(
        mxServer,
        25, // Standard SMTP port
        false, // Start with non-SSL
        null, // No authentication for now
        job.email
      );

      // Update job status
      job.status = 'sent';
      job.sentAt = new Date();
      console.log(`Email job ${job.id} sent successfully`);

    } catch (error: any) {
      console.error(`Error processing email job ${job.id}:`, error);

      // Handle retry logic
      job.retries++;
      job.error = error.message;

      if (job.retries < job.maxRetries) {
        job.status = 'retry';
        console.log(`Email job ${job.id} will be retried (${job.retries}/${job.maxRetries})`);
        
        // Add delay before retry
        setTimeout(() => {
          job.status = 'pending';
        }, this.retryDelay * job.retries);
      } else {
        job.status = 'failed';
        console.log(`Email job ${job.id} failed after ${job.maxRetries} retries`);
      }
    }
  }

  /**
   * Get job by ID
   */
  getJob(jobId: string): EmailJob | null {
    return this.queue.find(job => job.id === jobId) || null;
  }

  /**
   * Remove job from queue
   */
  removeJob(jobId: string): boolean {
    const index = this.queue.findIndex(job => job.id === jobId);
    if (index !== -1) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get queue statistics
   */
  getQueueStats(): QueueStats {
    const stats = {
      total: this.queue.length,
      pending: 0,
      processing: 0,
      sent: 0,
      failed: 0,
      retry: 0
    };

    this.queue.forEach(job => {
      switch (job.status) {
        case 'pending':
          stats.pending++;
          break;
        case 'processing':
          stats.processing++;
          break;
        case 'sent':
          stats.sent++;
          break;
        case 'failed':
          stats.failed++;
          break;
        case 'retry':
          stats.retry++;
          break;
      }
    });

    return stats;
  }

  /**
   * Get all jobs
   */
  getAllJobs(): EmailJob[] {
    return [...this.queue];
  }

  /**
   * Get jobs by status
   */
  getJobsByStatus(status: EmailJob['status']): EmailJob[] {
    return this.queue.filter(job => job.status === status);
  }

  /**
   * Clear completed jobs (sent and failed)
   */
  clearCompletedJobs(): number {
    const initialLength = this.queue.length;
    this.queue = this.queue.filter(job => 
      job.status !== 'sent' && job.status !== 'failed'
    );
    return initialLength - this.queue.length;
  }

  /**
   * Retry failed jobs
   */
  retryFailedJobs(): number {
    let retryCount = 0;
    this.queue.forEach(job => {
      if (job.status === 'failed' && job.retries < job.maxRetries) {
        job.status = 'pending';
        job.retries = 0;
        job.error = undefined;
        retryCount++;
      }
    });
    return retryCount;
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Check if queue is empty
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * Check if queue is processing
   */
  isProcessing(): boolean {
    return this.processing;
  }

  /**
   * Set max retries
   */
  setMaxRetries(maxRetries: number): void {
    this.maxRetries = maxRetries;
  }

  /**
   * Set retry delay
   */
  setRetryDelay(delay: number): void {
    this.retryDelay = delay;
  }

  /**
   * Set processing interval
   */
  setProcessingInterval(interval: number): void {
    this.processingInterval = interval;
    if (this.intervalId) {
      this.stopProcessing();
      this.startProcessing();
    }
  }
} 