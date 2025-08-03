import { EmailJob, EmailData, DomainConfig, QueueStats } from '../types';
export declare class EmailQueue {
    private queue;
    private processing;
    private maxRetries;
    private retryDelay;
    private processingInterval;
    private intervalId;
    constructor();
    /**
     * Add email to queue
     */
    addToQueue(email: EmailData, domainConfig: DomainConfig): Promise<string>;
    /**
     * Start background processing
     */
    private startProcessing;
    /**
     * Stop background processing
     */
    stopProcessing(): void;
    /**
     * Process email queue
     */
    private processQueue;
    /**
     * Process individual email job
     */
    private processJob;
    /**
     * Get job by ID
     */
    getJob(jobId: string): EmailJob | null;
    /**
     * Remove job from queue
     */
    removeJob(jobId: string): boolean;
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
     * Clear completed jobs (sent and failed)
     */
    clearCompletedJobs(): number;
    /**
     * Retry failed jobs
     */
    retryFailedJobs(): number;
    /**
     * Get queue size
     */
    getQueueSize(): number;
    /**
     * Check if queue is empty
     */
    isEmpty(): boolean;
    /**
     * Check if queue is processing
     */
    isProcessing(): boolean;
    /**
     * Set max retries
     */
    setMaxRetries(maxRetries: number): void;
    /**
     * Set retry delay
     */
    setRetryDelay(delay: number): void;
    /**
     * Set processing interval
     */
    setProcessingInterval(interval: number): void;
}
//# sourceMappingURL=email-queue.d.ts.map