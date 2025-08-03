import { SPFResult, DKIMResult, DMARCResult, EmailAuthResult } from '../types';

export class EmailAuth {
  /**
   * Validate SPF record
   */
  validateSPF(spfRecord: string, clientIP: string, senderDomain: string): SPFResult {
    try {
      if (!spfRecord || !spfRecord.startsWith('v=spf1')) {
        return { result: 'none' };
      }

      const mechanisms = spfRecord.split(' ');
      let result: SPFResult['result'] = 'neutral';

      for (const mechanism of mechanisms) {
        if (mechanism === 'v=spf1') continue;

        const parsed = this.parseSPFMechanism(mechanism);
        if (!parsed) continue;

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
    } catch (error) {
      return { result: 'temperror' };
    }
  }

  /**
   * Parse SPF mechanism
   */
  private parseSPFMechanism(mechanism: string): { qualifier: string; type: string; value: string } | null {
    const match = mechanism.match(/^([+-~?])?(all|ip4|ip6|a|mx|include|exists):(.+)$/);
    if (!match) return null;

    return {
      qualifier: match[1] || '+',
      type: match[2],
      value: match[3]
    };
  }

  /**
   * Check if IP is in range
   */
  private isIPInRange(ip: string, range: string): boolean {
    // Simple IP range check - in production, use a proper IP range library
    if (range.includes('/')) {
      // CIDR notation
      return this.isIPInCIDR(ip, range);
    } else {
      // Single IP
      return ip === range;
    }
  }

  /**
   * Check if IP is in CIDR range
   */
  private isIPInCIDR(ip: string, cidr: string): boolean {
    // Simplified CIDR check - in production, use a proper library
    const [network, bits] = cidr.split('/');
    return ip.startsWith(network.split('.').slice(0, parseInt(bits) / 8).join('.'));
  }

  /**
   * Validate DKIM signature
   */
  validateDKIM(dkimRecord: string, emailHeaders: string, signature: string): DKIMResult {
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
    } catch (error) {
      return { result: 'temperror' };
    }
  }

  /**
   * Parse DKIM record
   */
  private parseDKIMRecord(dkimRecord: string): { k: string; p: string } | null {
    const match = dkimRecord.match(/v=DKIM1;\s*k=([^;]+);\s*p=([^;]+)/);
    if (!match) return null;

    return {
      k: match[1], // Key type
      p: match[2]  // Public key
    };
  }

  /**
   * Validate DMARC policy
   */
  validateDMARC(dmarcRecord: string, spfResult: SPFResult, dkimResult: DKIMResult): DMARCResult {
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
      let result: DMARCResult['result'] = 'neutral';
      
      if (dmarcData.p === 'reject') {
        result = (spfPassed || dkimPassed) ? 'pass' : 'fail';
      } else if (dmarcData.p === 'quarantine') {
        result = (spfPassed || dkimPassed) ? 'pass' : 'fail';
      } else {
        result = 'neutral';
      }

      return { 
        result,
        policy: dmarcData.p
      };
    } catch (error) {
      return { result: 'temperror' };
    }
  }

  /**
   * Parse DMARC record
   */
  private parseDMARCRecord(dmarcRecord: string): { p: string; rua?: string; ruf?: string } | null {
    const policyMatch = dmarcRecord.match(/p=([^;]+)/);
    const ruaMatch = dmarcRecord.match(/rua=mailto:([^;]+)/);
    const rufMatch = dmarcRecord.match(/ruf=mailto:([^;]+)/);

    if (!policyMatch) return null;

    return {
      p: policyMatch[1],
      rua: ruaMatch?.[1],
      ruf: rufMatch?.[1]
    };
  }

  /**
   * Complete email authentication validation
   */
  validateEmailAuth(
    spfRecord: string | null,
    dkimRecord: string | null,
    dmarcRecord: string | null,
    clientIP: string,
    senderDomain: string,
    emailHeaders: string,
    signature: string
  ): EmailAuthResult {
    // Validate SPF
    const spfResult = spfRecord 
      ? this.validateSPF(spfRecord, clientIP, senderDomain)
      : { result: 'none' as const };

    // Validate DKIM
    const dkimResult = dkimRecord 
      ? this.validateDKIM(dkimRecord, emailHeaders, signature)
      : { result: 'none' as const };

    // Validate DMARC
    const dmarcResult = dmarcRecord 
      ? this.validateDMARC(dmarcRecord, spfResult, dkimResult)
      : { result: 'none' as const };

    // Determine overall result
    const overall = (
      spfResult.result === 'pass' || 
      dkimResult.result === 'pass' || 
      dmarcResult.result === 'pass'
    );

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
  generateSPFRecord(domain: string, allowedIPs: string[]): string {
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
  generateDKIMRecord(selector: string, publicKey: string): string {
    return `v=DKIM1; k=rsa; p=${publicKey}`;
  }

  /**
   * Generate DMARC record for a domain
   */
  generateDMARCRecord(domain: string, policy: 'none' | 'quarantine' | 'reject' = 'quarantine'): string {
    return `v=DMARC1; p=${policy}; rua=mailto:dmarc@${domain}; ruf=mailto:dmarc@${domain}; sp=${policy}; adkim=r; aspf=r;`;
  }
} 