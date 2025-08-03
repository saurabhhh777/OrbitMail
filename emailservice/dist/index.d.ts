import { DomainConfig, EmailJob, QueueStats } from './types';
export declare class OrbitMailEmailService {
    private emailQueue;
    private dnsResolver;
    private domainConfigs;
    constructor();
    /**
     * Add domain configuration
     */
    addDomain(domain: string, mxRecords: string[]): Promise<void>;
    /**
     * Remove domain configuration
     */
    removeDomain(domain: string): boolean;
    /**
     * Get domain configuration
     */
    getDomainConfig(domain: string): DomainConfig | null;
    /**
     * List all domains
     */
    getAllDomains(): string[];
    /**
     * Send email from custom domain
     */
    sendFromDomain(from: string, to: string, subject: string, text: string): Promise<string>;
    /**
     * Send email immediately (synchronous)
     */
    sendEmailImmediate(from: string, to: string, subject: string, text: string): Promise<void>;
    /**
     * Get job status
     */
    getJobStatus(jobId: string): EmailJob | null;
    /**
     * Get queue statistics
     */
    getQueueStats(): QueueStats;
    /**
     * Get all jobs
     */
    getAllJobs(): EmailJob[];
    /**
     * Get jobs by status
     */
    getJobsByStatus(status: EmailJob['status']): EmailJob[];
    /**
     * Clear completed jobs
     */
    clearCompletedJobs(): number;
    /**
     * Retry failed jobs
     */
    retryFailedJobs(): number;
    /**
     * Verify domain email configuration
     */
    verifyDomain(domain: string): Promise<boolean>;
    /**
     * Get domain DNS information
     */
    getDomainDNSInfo(domain: string): Promise<import("./types").DNSResolutionResult>;
    /**
     * Test email sending for a domain
     */
    testDomainEmail(domain: string, testEmail: string): Promise<boolean>;
    /**
     * Stop the email service
     */
    stop(): void;
    /**
     * Get service status
     */
    getStatus(): {
        domains: number;
        queueSize: number;
        isProcessing: boolean;
        queueStats: QueueStats;
    };
}
export { CustomSMTPClient } from './smtp/client';
export { DNSResolver } from './dns/resolver';
export { EmailQueue } from './queue/email-queue';
export * from './types';
//# sourceMappingURL=index.d.ts.map