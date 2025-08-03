import * as crypto from 'crypto';

/**
 * Generate a unique message ID
 */
export function generateMessageId(domain: string): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `${timestamp}.${random}@${domain}`;
}

/**
 * Generate a unique job ID
 */
export function generateJobId(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Format email address
 */
export function formatEmailAddress(email: string, name?: string): string {
  if (name) {
    return `${name} <${email}>`;
  }
  return email;
}

/**
 * Parse email address
 */
export function parseEmailAddress(emailWithName: string): { email: string; name?: string } {
  const match = emailWithName.match(/^"?([^"<]+)"?\s*<(.+)>$/);
  if (match) {
    return {
      name: match[1].trim(),
      email: match[2].trim()
    };
  }
  return { email: emailWithName.trim() };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Extract domain from email
 */
export function extractDomain(email: string): string {
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }
  return email.split('@')[1];
}

/**
 * Generate DKIM signature
 */
export function generateDKIMSignature(
  headers: string,
  body: string,
  privateKey: string,
  selector: string,
  domain: string
): string {
  // In a real implementation, you would:
  // 1. Create the DKIM-Signature header
  // 2. Sign the headers and body with the private key
  // 3. Return the signature
  
  // For now, return a placeholder
  return `b=${crypto.randomBytes(32).toString('base64')}`;
}

/**
 * Encode email content for transmission
 */
export function encodeEmailContent(content: string): string {
  // Simple encoding - in production, use proper MIME encoding
  return content.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
}

/**
 * Decode email content
 */
export function decodeEmailContent(content: string): string {
  return content.replace(/\r\n/g, '\n');
}

/**
 * Generate email headers
 */
export function generateEmailHeaders(
  from: string,
  to: string,
  subject: string,
  messageId: string,
  date: Date = new Date()
): string[] {
  return [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Date: ${date.toUTCString()}`,
    `Message-ID: <${messageId}>`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`
  ];
}

/**
 * Parse email headers
 */
export function parseEmailHeaders(headers: string): Record<string, string> {
  const parsed: Record<string, string> = {};
  const lines = headers.split('\r\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      parsed[key.toLowerCase()] = value;
    }
  }
  
  return parsed;
}

/**
 * Generate SPF record
 */
export function generateSPFRecord(domain: string, allowedIPs: string[]): string {
  const mechanisms = ['v=spf1'];
  
  // Add IP mechanisms
  allowedIPs.forEach(ip => {
    mechanisms.push(`ip4:${ip}`);
  });
  
  // Add common email providers
  mechanisms.push('include:_spf.google.com');
  mechanisms.push('include:_spf.mailgun.org');
  
  // Add all mechanism with - qualifier (fail)
  mechanisms.push('-all');
  
  return mechanisms.join(' ');
}

/**
 * Generate DKIM record
 */
export function generateDKIMRecord(selector: string, publicKey: string): string {
  return `v=DKIM1; k=rsa; p=${publicKey}`;
}

/**
 * Generate DMARC record
 */
export function generateDMARCRecord(domain: string, policy: 'none' | 'quarantine' | 'reject' = 'quarantine'): string {
  return `v=DMARC1; p=${policy}; rua=mailto:dmarc@${domain}; ruf=mailto:dmarc@${domain}; sp=${policy}; adkim=r; aspf=r;`;
}

/**
 * Format date for email headers
 */
export function formatEmailDate(date: Date = new Date()): string {
  return date.toUTCString();
}

/**
 * Parse email date
 */
export function parseEmailDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Generate boundary for multipart emails
 */
export function generateBoundary(): string {
  return `----=_NextPart_${crypto.randomBytes(8).toString('hex')}`;
}

/**
 * Escape email content
 */
export function escapeEmailContent(content: string): string {
  return content
    .replace(/\./g, '..')
    .replace(/\r\n/g, '\n')
    .replace(/\n/g, '\r\n');
}

/**
 * Unescape email content
 */
export function unescapeEmailContent(content: string): string {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/\.\./g, '.');
}

/**
 * Calculate email size
 */
export function calculateEmailSize(headers: string, body: string): number {
  return Buffer.byteLength(headers + '\r\n\r\n' + body, 'utf8');
}

/**
 * Check if email size is within limits
 */
export function isEmailSizeValid(size: number, maxSize: number = 10 * 1024 * 1024): boolean {
  return size <= maxSize;
}

/**
 * Generate email fingerprint
 */
export function generateEmailFingerprint(headers: string, body: string): string {
  const content = headers + '\r\n\r\n' + body;
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Validate domain name
 */
export function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain);
}

/**
 * Normalize domain name
 */
export function normalizeDomain(domain: string): string {
  return domain.toLowerCase().trim();
}

/**
 * Generate random string
 */
export function generateRandomString(length: number): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash email address for privacy
 */
export function hashEmail(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
}

/**
 * Check if email is disposable
 */
export function isDisposableEmail(email: string): boolean {
  const disposableDomains = [
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'tempmail.org',
    'throwaway.email'
  ];
  
  const domain = extractDomain(email);
  return disposableDomains.includes(domain);
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, [now]);
      return true;
    }

    const requests = this.requests.get(identifier)!;
    const validRequests = requests.filter(time => time > windowStart);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      return this.maxRequests;
    }

    const requests = this.requests.get(identifier)!;
    const validRequests = requests.filter(time => time > windowStart);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
} 