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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailQueue = exports.DNSResolver = exports.CustomSMTPClient = exports.OrbitMailEmailService = void 0;
const client_1 = require("./smtp/client");
const resolver_1 = require("./dns/resolver");
const email_queue_1 = require("./queue/email-queue");
class OrbitMailEmailService {
    constructor() {
        this.domainConfigs = new Map();
        this.emailQueue = new email_queue_1.EmailQueue();
        this.dnsResolver = new resolver_1.DNSResolver();
    }
    /**
     * Add domain configuration
     */
    async addDomain(domain, mxRecords) {
        // Verify domain has proper email configuration
        const isValid = await this.dnsResolver.verifyDomainEmailConfig(domain);
        if (!isValid) {
            throw new Error(`Domain ${domain} does not have proper email configuration`);
        }
        // Get complete DNS resolution
        const resolution = await this.dnsResolver.resolveDomain(domain);
        const domainConfig = {
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
    removeDomain(domain) {
        return this.domainConfigs.delete(domain);
    }
    /**
     * Get domain configuration
     */
    getDomainConfig(domain) {
        return this.domainConfigs.get(domain) || null;
    }
    /**
     * List all domains
     */
    getAllDomains() {
        return Array.from(this.domainConfigs.keys());
    }
    /**
     * Send email from custom domain
     */
    async sendFromDomain(from, to, subject, text) {
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
        const emailData = {
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
    async sendEmailImmediate(from, to, subject, text) {
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
        const smtpClient = new client_1.CustomSMTPClient();
        await smtpClient.sendEmailWithConnection(mxServer, 25, false, null, { from, to, subject, text });
        console.log(`Email sent immediately from ${from} to ${to}`);
    }
    /**
     * Get job status
     */
    getJobStatus(jobId) {
        return this.emailQueue.getJob(jobId);
    }
    /**
     * Get queue statistics
     */
    getQueueStats() {
        return this.emailQueue.getQueueStats();
    }
    /**
     * Get all jobs
     */
    getAllJobs() {
        return this.emailQueue.getAllJobs();
    }
    /**
     * Get jobs by status
     */
    getJobsByStatus(status) {
        return this.emailQueue.getJobsByStatus(status);
    }
    /**
     * Clear completed jobs
     */
    clearCompletedJobs() {
        return this.emailQueue.clearCompletedJobs();
    }
    /**
     * Retry failed jobs
     */
    retryFailedJobs() {
        return this.emailQueue.retryFailedJobs();
    }
    /**
     * Verify domain email configuration
     */
    async verifyDomain(domain) {
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
        }
        catch (error) {
            console.error(`Domain verification failed for ${domain}:`, error);
            return false;
        }
    }
    /**
     * Get domain DNS information
     */
    async getDomainDNSInfo(domain) {
        return await this.dnsResolver.resolveDomain(domain);
    }
    /**
     * Test email sending for a domain
     */
    async testDomainEmail(domain, testEmail) {
        try {
            const domainConfig = this.getDomainConfig(domain);
            if (!domainConfig) {
                throw new Error(`Domain ${domain} not configured`);
            }
            // Send test email
            await this.sendEmailImmediate(`test@${domain}`, testEmail, 'Test Email from OrbitMail', 'This is a test email to verify domain configuration.');
            return true;
        }
        catch (error) {
            console.error(`Domain email test failed for ${domain}:`, error);
            return false;
        }
    }
    /**
     * Stop the email service
     */
    stop() {
        this.emailQueue.stopProcessing();
        console.log('Email service stopped');
    }
    /**
     * Get service status
     */
    getStatus() {
        return {
            domains: this.domainConfigs.size,
            queueSize: this.emailQueue.getQueueSize(),
            isProcessing: this.emailQueue.isProcessing(),
            queueStats: this.emailQueue.getQueueStats()
        };
    }
}
exports.OrbitMailEmailService = OrbitMailEmailService;
// Export individual components for direct use
var client_2 = require("./smtp/client");
Object.defineProperty(exports, "CustomSMTPClient", { enumerable: true, get: function () { return client_2.CustomSMTPClient; } });
var resolver_2 = require("./dns/resolver");
Object.defineProperty(exports, "DNSResolver", { enumerable: true, get: function () { return resolver_2.DNSResolver; } });
var email_queue_2 = require("./queue/email-queue");
Object.defineProperty(exports, "EmailQueue", { enumerable: true, get: function () { return email_queue_2.EmailQueue; } });
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map