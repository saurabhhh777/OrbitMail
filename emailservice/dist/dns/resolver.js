"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DNSResolver = void 0;
const dns_1 = require("dns");
const types_1 = require("../types");
class DNSResolver {
    /**
     * Resolve MX records for a domain
     */
    async resolveMX(domain) {
        try {
            const mxRecords = await dns_1.promises.resolveMx(domain);
            return mxRecords.map(record => ({
                priority: record.priority,
                exchange: record.exchange
            }));
        }
        catch (error) {
            throw new types_1.DNSError(`Failed to resolve MX records for ${domain}: ${error}`);
        }
    }
    /**
     * Resolve SPF record for a domain
     */
    async resolveSPF(domain) {
        try {
            const txtRecords = await dns_1.promises.resolveTxt(domain);
            const spfRecord = txtRecords.flat().find(record => record.startsWith('v=spf1'));
            return spfRecord || null;
        }
        catch (error) {
            console.warn(`Failed to resolve SPF record for ${domain}: ${error}`);
            return null;
        }
    }
    /**
     * Resolve DKIM record for a domain
     */
    async resolveDKIM(domain, selector = 'default') {
        try {
            const dkimDomain = `${selector}._domainkey.${domain}`;
            const txtRecords = await dns_1.promises.resolveTxt(dkimDomain);
            const dkimRecord = txtRecords.flat().find(record => record.startsWith('v=DKIM1'));
            return dkimRecord || null;
        }
        catch (error) {
            console.warn(`Failed to resolve DKIM record for ${domain}: ${error}`);
            return null;
        }
    }
    /**
     * Resolve DMARC record for a domain
     */
    async resolveDMARC(domain) {
        try {
            const dmarcDomain = `_dmarc.${domain}`;
            const txtRecords = await dns_1.promises.resolveTxt(dmarcDomain);
            const dmarcRecord = txtRecords.flat().find(record => record.startsWith('v=DMARC1'));
            return dmarcRecord || null;
        }
        catch (error) {
            console.warn(`Failed to resolve DMARC record for ${domain}: ${error}`);
            return null;
        }
    }
    /**
     * Complete DNS resolution for a domain
     */
    async resolveDomain(domain) {
        try {
            const [mxRecords, spfRecord, dkimRecord, dmarcRecord] = await Promise.allSettled([
                this.resolveMX(domain),
                this.resolveSPF(domain),
                this.resolveDKIM(domain),
                this.resolveDMARC(domain)
            ]);
            return {
                mxRecords: mxRecords.status === 'fulfilled' ? mxRecords.value : [],
                spfRecord: spfRecord.status === 'fulfilled' ? spfRecord.value || undefined : undefined,
                dkimRecord: dkimRecord.status === 'fulfilled' ? dkimRecord.value || undefined : undefined,
                dmarcRecord: dmarcRecord.status === 'fulfilled' ? dmarcRecord.value || undefined : undefined
            };
        }
        catch (error) {
            throw new types_1.DNSError(`Failed to resolve domain ${domain}: ${error}`);
        }
    }
    /**
     * Verify if a domain has proper email configuration
     */
    async verifyDomainEmailConfig(domain) {
        try {
            const resolution = await this.resolveDomain(domain);
            // Check if MX records exist
            if (resolution.mxRecords.length === 0) {
                return false;
            }
            // Check if SPF record exists (recommended)
            if (!resolution.spfRecord) {
                console.warn(`No SPF record found for ${domain}`);
            }
            return true;
        }
        catch (error) {
            console.error(`Domain verification failed for ${domain}: ${error}`);
            return false;
        }
    }
    /**
     * Get the best MX server for a domain
     */
    async getBestMXServer(domain) {
        try {
            const mxRecords = await this.resolveMX(domain);
            if (mxRecords.length === 0) {
                return null;
            }
            // Sort by priority (lower is better)
            const sortedRecords = mxRecords.sort((a, b) => a.priority - b.priority);
            return sortedRecords[0].exchange;
        }
        catch (error) {
            throw new types_1.DNSError(`Failed to get best MX server for ${domain}: ${error}`);
        }
    }
    /**
     * Validate email format
     */
    validateEmailFormat(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    /**
     * Extract domain from email
     */
    extractDomain(email) {
        if (!this.validateEmailFormat(email)) {
            throw new Error('Invalid email format');
        }
        return email.split('@')[1];
    }
}
exports.DNSResolver = DNSResolver;
//# sourceMappingURL=resolver.js.map