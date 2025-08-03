import { DNSResolutionResult, MXRecord } from '../types';
export declare class DNSResolver {
    /**
     * Resolve MX records for a domain
     */
    resolveMX(domain: string): Promise<MXRecord[]>;
    /**
     * Resolve SPF record for a domain
     */
    resolveSPF(domain: string): Promise<string | null>;
    /**
     * Resolve DKIM record for a domain
     */
    resolveDKIM(domain: string, selector?: string): Promise<string | null>;
    /**
     * Resolve DMARC record for a domain
     */
    resolveDMARC(domain: string): Promise<string | null>;
    /**
     * Complete DNS resolution for a domain
     */
    resolveDomain(domain: string): Promise<DNSResolutionResult>;
    /**
     * Verify if a domain has proper email configuration
     */
    verifyDomainEmailConfig(domain: string): Promise<boolean>;
    /**
     * Get the best MX server for a domain
     */
    getBestMXServer(domain: string): Promise<string | null>;
    /**
     * Validate email format
     */
    validateEmailFormat(email: string): boolean;
    /**
     * Extract domain from email
     */
    extractDomain(email: string): string;
}
//# sourceMappingURL=resolver.d.ts.map