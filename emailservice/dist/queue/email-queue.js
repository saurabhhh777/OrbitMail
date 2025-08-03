"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueue = void 0;
const uuid_1 = require("uuid");
const client_1 = require("../smtp/client");
const resolver_1 = require("../dns/resolver");
class EmailQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.maxRetries = 3;
        this.retryDelay = 5000; // 5 seconds
        this.processingInterval = 1000; // 1 second
        this.intervalId = null;
        this.startProcessing();
    }
    /**
     * Add email to queue
     */
    async addToQueue(email, domainConfig) {
        const job = {
            id: (0, uuid_1.v4)(),
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
    startProcessing() {
        this.intervalId = setInterval(() => {
            this.processQueue();
        }, this.processingInterval);
    }
    /**
     * Stop background processing
     */
    stopProcessing() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    /**
     * Process email queue
     */
    async processQueue() {
        if (this.processing || this.queue.length === 0) {
            return;
        }
        this.processing = true;
        try {
            const pendingJobs = this.queue.filter(job => job.status === 'pending' || job.status === 'retry');
            for (const job of pendingJobs) {
                await this.processJob(job);
            }
        }
        catch (error) {
            console.error('Error processing email queue:', error);
        }
        finally {
            this.processing = false;
        }
    }
    /**
     * Process individual email job
     */
    async processJob(job) {
        try {
            console.log(`Processing email job ${job.id}`);
            // Update job status
            job.status = 'processing';
            // Get MX server for domain
            const dnsResolver = new resolver_1.DNSResolver();
            const mxServer = await dnsResolver.getBestMXServer(job.domainConfig.domain);
            if (!mxServer) {
                throw new Error(`No MX server found for domain: ${job.domainConfig.domain}`);
            }
            // Send email using SMTP client
            const smtpClient = new client_1.CustomSMTPClient();
            await smtpClient.sendEmailWithConnection(mxServer, 25, // Standard SMTP port
            false, // Start with non-SSL
            null, // No authentication for now
            job.email);
            // Update job status
            job.status = 'sent';
            job.sentAt = new Date();
            console.log(`Email job ${job.id} sent successfully`);
        }
        catch (error) {
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
            }
            else {
                job.status = 'failed';
                console.log(`Email job ${job.id} failed after ${job.maxRetries} retries`);
            }
        }
    }
    /**
     * Get job by ID
     */
    getJob(jobId) {
        return this.queue.find(job => job.id === jobId) || null;
    }
    /**
     * Remove job from queue
     */
    removeJob(jobId) {
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
    getQueueStats() {
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
    getAllJobs() {
        return [...this.queue];
    }
    /**
     * Get jobs by status
     */
    getJobsByStatus(status) {
        return this.queue.filter(job => job.status === status);
    }
    /**
     * Clear completed jobs (sent and failed)
     */
    clearCompletedJobs() {
        const initialLength = this.queue.length;
        this.queue = this.queue.filter(job => job.status !== 'sent' && job.status !== 'failed');
        return initialLength - this.queue.length;
    }
    /**
     * Retry failed jobs
     */
    retryFailedJobs() {
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
    getQueueSize() {
        return this.queue.length;
    }
    /**
     * Check if queue is empty
     */
    isEmpty() {
        return this.queue.length === 0;
    }
    /**
     * Check if queue is processing
     */
    isProcessing() {
        return this.processing;
    }
    /**
     * Set max retries
     */
    setMaxRetries(maxRetries) {
        this.maxRetries = maxRetries;
    }
    /**
     * Set retry delay
     */
    setRetryDelay(delay) {
        this.retryDelay = delay;
    }
    /**
     * Set processing interval
     */
    setProcessingInterval(interval) {
        this.processingInterval = interval;
        if (this.intervalId) {
            this.stopProcessing();
            this.startProcessing();
        }
    }
}
exports.EmailQueue = EmailQueue;
//# sourceMappingURL=email-queue.js.map