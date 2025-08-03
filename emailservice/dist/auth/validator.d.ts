import { SPFResult, DKIMResult, DMARCResult, EmailAuthResult } from '../types';
export declare class EmailAuth {
    /**
     * Validate SPF record
     */
    validateSPF(spfRecord: string, clientIP: string, senderDomain: string): SPFResult;
    /**
     * Parse SPF mechanism
     */
    private parseSPFMechanism;
    /**
     * Check if IP is in range
     */
    private isIPInRange;
    /**
     * Check if IP is in CIDR range
     */
    private isIPInCIDR;
    /**
     * Validate DKIM signature
     */
    validateDKIM(dkimRecord: string, emailHeaders: string, signature: string): DKIMResult;
    /**
     * Parse DKIM record
     */
    private parseDKIMRecord;
    /**
     * Validate DMARC policy
     */
    validateDMARC(dmarcRecord: string, spfResult: SPFResult, dkimResult: DKIMResult): DMARCResult;
    /**
     * Parse DMARC record
     */
    private parseDMARCRecord;
    /**
     * Complete email authentication validation
     */
    validateEmailAuth(spfRecord: string | null, dkimRecord: string | null, dmarcRecord: string | null, clientIP: string, senderDomain: string, emailHeaders: string, signature: string): EmailAuthResult;
    /**
     * Generate SPF record for a domain
     */
    generateSPFRecord(domain: string, allowedIPs: string[]): string;
    /**
     * Generate DKIM record for a domain
     */
    generateDKIMRecord(selector: string, publicKey: string): string;
    /**
     * Generate DMARC record for a domain
     */
    generateDMARCRecord(domain: string, policy?: 'none' | 'quarantine' | 'reject'): string;
}
//# sourceMappingURL=validator.d.ts.map