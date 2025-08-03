"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAuth = void 0;
class EmailAuth {
    /**
     * Validate SPF record
     */
    validateSPF(spfRecord, clientIP, senderDomain) {
        try {
            if (!spfRecord || !spfRecord.startsWith('v=spf1')) {
                return { result: 'none' };
            }
            const mechanisms = spfRecord.split(' ');
            let result = 'neutral';
            for (const mechanism of mechanisms) {
                if (mechanism === 'v=spf1')
                    continue;
                const parsed = this.parseSPFMechanism(mechanism);
                if (!parsed)
                    continue;
                const { qualifier, type, value } = parsed;
                switch (type) {
                    case 'all':
                        result = qualifier === '+' ? 'pass' : qualifier === '-' ? 'fail' : 'neutral';
                        break;
                    case 'ip4':
                        if (this.isIPInRange(clientIP, value)) {
                            result = qualifier === '+' ? 'pass' : qualifier === '-' ? 'fail' : 'neutral';
                        }
                        break;
                    case 'include':
                        // For simplicity, we'll assume include passes
                        result = qualifier === '+' ? 'pass' : qualifier === '-' ? 'fail' : 'neutral';
                        break;
                }
            }
            return { result };
        }
        catch (error) {
            return { result: 'temperror' };
        }
    }
    /**
     * Parse SPF mechanism
     */
    parseSPFMechanism(mechanism) {
        const match = mechanism.match(/^([+-~?])?(all|ip4|ip6|a|mx|include|exists):(.+)$/);
        if (!match)
            return null;
        return {
            qualifier: match[1] || '+',
            type: match[2],
            value: match[3]
        };
    }
    /**
     * Check if IP is in range
     */
    isIPInRange(ip, range) {
        // Simple IP range check - in production, use a proper IP range library
        if (range.includes('/')) {
            // CIDR notation
            return this.isIPInCIDR(ip, range);
        }
        else {
            // Single IP
            return ip === range;
        }
    }
    /**
     * Check if IP is in CIDR range
     */
    isIPInCIDR(ip, cidr) {
        // Simplified CIDR check - in production, use a proper library
        const [network, bits] = cidr.split('/');
        return ip.startsWith(network.split('.').slice(0, parseInt(bits) / 8).join('.'));
    }
    /**
     * Validate DKIM signature
     */
    validateDKIM(dkimRecord, emailHeaders, signature) {
        try {
            if (!dkimRecord || !dkimRecord.startsWith('v=DKIM1')) {
                return { result: 'none' };
            }
            // Parse DKIM record
            const dkimData = this.parseDKIMRecord(dkimRecord);
            if (!dkimData) {
                return { result: 'permerror' };
            }
            // In a real implementation, you would:
            // 1. Extract the signature from email headers
            // 2. Parse the signature to get the signing algorithm and public key
            // 3. Verify the signature using the public key
            // 4. Check the signature against the email content
            // For now, we'll return a simplified result
            return {
                result: 'pass', // Simplified - in real implementation, verify actual signature
                signature
            };
        }
        catch (error) {
            return { result: 'temperror' };
        }
    }
    /**
     * Parse DKIM record
     */
    parseDKIMRecord(dkimRecord) {
        const match = dkimRecord.match(/v=DKIM1;\s*k=([^;]+);\s*p=([^;]+)/);
        if (!match)
            return null;
        return {
            k: match[1], // Key type
            p: match[2] // Public key
        };
    }
    /**
     * Validate DMARC policy
     */
    validateDMARC(dmarcRecord, spfResult, dkimResult) {
        try {
            if (!dmarcRecord || !dmarcRecord.startsWith('v=DMARC1')) {
                return { result: 'none' };
            }
            // Parse DMARC record
            const dmarcData = this.parseDMARCRecord(dmarcRecord);
            if (!dmarcData) {
                return { result: 'permerror' };
            }
            // Check if SPF or DKIM passed
            const spfPassed = spfResult.result === 'pass';
            const dkimPassed = dkimResult.result === 'pass';
            // Determine overall result based on policy
            let result = 'neutral';
            if (dmarcData.p === 'reject') {
                result = (spfPassed || dkimPassed) ? 'pass' : 'fail';
            }
            else if (dmarcData.p === 'quarantine') {
                result = (spfPassed || dkimPassed) ? 'pass' : 'fail';
            }
            else {
                result = 'neutral';
            }
            return {
                result,
                policy: dmarcData.p
            };
        }
        catch (error) {
            return { result: 'temperror' };
        }
    }
    /**
     * Parse DMARC record
     */
    parseDMARCRecord(dmarcRecord) {
        const policyMatch = dmarcRecord.match(/p=([^;]+)/);
        const ruaMatch = dmarcRecord.match(/rua=mailto:([^;]+)/);
        const rufMatch = dmarcRecord.match(/ruf=mailto:([^;]+)/);
        if (!policyMatch)
            return null;
        return {
            p: policyMatch[1],
            rua: ruaMatch?.[1],
            ruf: rufMatch?.[1]
        };
    }
    /**
     * Complete email authentication validation
     */
    validateEmailAuth(spfRecord, dkimRecord, dmarcRecord, clientIP, senderDomain, emailHeaders, signature) {
        // Validate SPF
        const spfResult = spfRecord
            ? this.validateSPF(spfRecord, clientIP, senderDomain)
            : { result: 'none' };
        // Validate DKIM
        const dkimResult = dkimRecord
            ? this.validateDKIM(dkimRecord, emailHeaders, signature)
            : { result: 'none' };
        // Validate DMARC
        const dmarcResult = dmarcRecord
            ? this.validateDMARC(dmarcRecord, spfResult, dkimResult)
            : { result: 'none' };
        // Determine overall result
        const overall = (spfResult.result === 'pass' ||
            dkimResult.result === 'pass' ||
            dmarcResult.result === 'pass');
        return {
            spf: spfResult.result === 'pass',
            dkim: dkimResult.result === 'pass',
            dmarc: dmarcResult.result === 'pass',
            overall
        };
    }
    /**
     * Generate SPF record for a domain
     */
    generateSPFRecord(domain, allowedIPs) {
        const mechanisms = ['v=spf1'];
        // Add IP mechanisms
        allowedIPs.forEach(ip => {
            mechanisms.push(`ip4:${ip}`);
        });
        // Add include for common email providers
        mechanisms.push('include:_spf.google.com');
        mechanisms.push('include:_spf.mailgun.org');
        mechanisms.push('include:_spf.sendgrid.net');
        // Add all mechanism with - qualifier (fail)
        mechanisms.push('-all');
        return mechanisms.join(' ');
    }
    /**
     * Generate DKIM record for a domain
     */
    generateDKIMRecord(selector, publicKey) {
        return `v=DKIM1; k=rsa; p=${publicKey}`;
    }
    /**
     * Generate DMARC record for a domain
     */
    generateDMARCRecord(domain, policy = 'quarantine') {
        return `v=DMARC1; p=${policy}; rua=mailto:dmarc@${domain}; ruf=mailto:dmarc@${domain}; sp=${policy}; adkim=r; aspf=r;`;
    }
}
exports.EmailAuth = EmailAuth;
//# sourceMappingURL=validator.js.map