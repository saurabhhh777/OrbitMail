/**
 * Generate a unique message ID
 */
export declare function generateMessageId(domain: string): string;
/**
 * Generate a unique job ID
 */
export declare function generateJobId(): string;
/**
 * Format email address
 */
export declare function formatEmailAddress(email: string, name?: string): string;
/**
 * Parse email address
 */
export declare function parseEmailAddress(emailWithName: string): {
    email: string;
    name?: string;
};
/**
 * Validate email format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Extract domain from email
 */
export declare function extractDomain(email: string): string;
/**
 * Generate DKIM signature
 */
export declare function generateDKIMSignature(headers: string, body: string, privateKey: string, selector: string, domain: string): string;
/**
 * Encode email content for transmission
 */
export declare function encodeEmailContent(content: string): string;
/**
 * Decode email content
 */
export declare function decodeEmailContent(content: string): string;
/**
 * Generate email headers
 */
export declare function generateEmailHeaders(from: string, to: string, subject: string, messageId: string, date?: Date): string[];
/**
 * Parse email headers
 */
export declare function parseEmailHeaders(headers: string): Record<string, string>;
/**
 * Generate SPF record
 */
export declare function generateSPFRecord(domain: string, allowedIPs: string[]): string;
/**
 * Generate DKIM record
 */
export declare function generateDKIMRecord(selector: string, publicKey: string): string;
/**
 * Generate DMARC record
 */
export declare function generateDMARCRecord(domain: string, policy?: 'none' | 'quarantine' | 'reject'): string;
/**
 * Format date for email headers
 */
export declare function formatEmailDate(date?: Date): string;
/**
 * Parse email date
 */
export declare function parseEmailDate(dateString: string): Date;
/**
 * Generate boundary for multipart emails
 */
export declare function generateBoundary(): string;
/**
 * Escape email content
 */
export declare function escapeEmailContent(content: string): string;
/**
 * Unescape email content
 */
export declare function unescapeEmailContent(content: string): string;
/**
 * Calculate email size
 */
export declare function calculateEmailSize(headers: string, body: string): number;
/**
 * Check if email size is within limits
 */
export declare function isEmailSizeValid(size: number, maxSize?: number): boolean;
/**
 * Generate email fingerprint
 */
export declare function generateEmailFingerprint(headers: string, body: string): string;
/**
 * Validate domain name
 */
export declare function isValidDomain(domain: string): boolean;
/**
 * Normalize domain name
 */
export declare function normalizeDomain(domain: string): string;
/**
 * Generate random string
 */
export declare function generateRandomString(length: number): string;
/**
 * Hash email address for privacy
 */
export declare function hashEmail(email: string): string;
/**
 * Check if email is disposable
 */
export declare function isDisposableEmail(email: string): boolean;
/**
 * Rate limiting helper
 */
export declare class RateLimiter {
    private requests;
    private maxRequests;
    private windowMs;
    constructor(maxRequests?: number, windowMs?: number);
    isAllowed(identifier: string): boolean;
    getRemainingRequests(identifier: string): number;
}
//# sourceMappingURL=helpers.d.ts.map