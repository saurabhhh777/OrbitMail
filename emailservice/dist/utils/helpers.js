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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
exports.generateMessageId = generateMessageId;
exports.generateJobId = generateJobId;
exports.formatEmailAddress = formatEmailAddress;
exports.parseEmailAddress = parseEmailAddress;
exports.isValidEmail = isValidEmail;
exports.extractDomain = extractDomain;
exports.generateDKIMSignature = generateDKIMSignature;
exports.encodeEmailContent = encodeEmailContent;
exports.decodeEmailContent = decodeEmailContent;
exports.generateEmailHeaders = generateEmailHeaders;
exports.parseEmailHeaders = parseEmailHeaders;
exports.generateSPFRecord = generateSPFRecord;
exports.generateDKIMRecord = generateDKIMRecord;
exports.generateDMARCRecord = generateDMARCRecord;
exports.formatEmailDate = formatEmailDate;
exports.parseEmailDate = parseEmailDate;
exports.generateBoundary = generateBoundary;
exports.escapeEmailContent = escapeEmailContent;
exports.unescapeEmailContent = unescapeEmailContent;
exports.calculateEmailSize = calculateEmailSize;
exports.isEmailSizeValid = isEmailSizeValid;
exports.generateEmailFingerprint = generateEmailFingerprint;
exports.isValidDomain = isValidDomain;
exports.normalizeDomain = normalizeDomain;
exports.generateRandomString = generateRandomString;
exports.hashEmail = hashEmail;
exports.isDisposableEmail = isDisposableEmail;
const crypto = __importStar(require("crypto"));
/**
 * Generate a unique message ID
 */
function generateMessageId(domain) {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `${timestamp}.${random}@${domain}`;
}
/**
 * Generate a unique job ID
 */
function generateJobId() {
    return crypto.randomBytes(16).toString('hex');
}
/**
 * Format email address
 */
function formatEmailAddress(email, name) {
    if (name) {
        return `${name} <${email}>`;
    }
    return email;
}
/**
 * Parse email address
 */
function parseEmailAddress(emailWithName) {
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
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Extract domain from email
 */
function extractDomain(email) {
    if (!isValidEmail(email)) {
        throw new Error('Invalid email format');
    }
    return email.split('@')[1];
}
/**
 * Generate DKIM signature
 */
function generateDKIMSignature(headers, body, privateKey, selector, domain) {
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
function encodeEmailContent(content) {
    // Simple encoding - in production, use proper MIME encoding
    return content.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
}
/**
 * Decode email content
 */
function decodeEmailContent(content) {
    return content.replace(/\r\n/g, '\n');
}
/**
 * Generate email headers
 */
function generateEmailHeaders(from, to, subject, messageId, date = new Date()) {
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
function parseEmailHeaders(headers) {
    const parsed = {};
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
function generateSPFRecord(domain, allowedIPs) {
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
function generateDKIMRecord(selector, publicKey) {
    return `v=DKIM1; k=rsa; p=${publicKey}`;
}
/**
 * Generate DMARC record
 */
function generateDMARCRecord(domain, policy = 'quarantine') {
    return `v=DMARC1; p=${policy}; rua=mailto:dmarc@${domain}; ruf=mailto:dmarc@${domain}; sp=${policy}; adkim=r; aspf=r;`;
}
/**
 * Format date for email headers
 */
function formatEmailDate(date = new Date()) {
    return date.toUTCString();
}
/**
 * Parse email date
 */
function parseEmailDate(dateString) {
    return new Date(dateString);
}
/**
 * Generate boundary for multipart emails
 */
function generateBoundary() {
    return `----=_NextPart_${crypto.randomBytes(8).toString('hex')}`;
}
/**
 * Escape email content
 */
function escapeEmailContent(content) {
    return content
        .replace(/\./g, '..')
        .replace(/\r\n/g, '\n')
        .replace(/\n/g, '\r\n');
}
/**
 * Unescape email content
 */
function unescapeEmailContent(content) {
    return content
        .replace(/\r\n/g, '\n')
        .replace(/\.\./g, '.');
}
/**
 * Calculate email size
 */
function calculateEmailSize(headers, body) {
    return Buffer.byteLength(headers + '\r\n\r\n' + body, 'utf8');
}
/**
 * Check if email size is within limits
 */
function isEmailSizeValid(size, maxSize = 10 * 1024 * 1024) {
    return size <= maxSize;
}
/**
 * Generate email fingerprint
 */
function generateEmailFingerprint(headers, body) {
    const content = headers + '\r\n\r\n' + body;
    return crypto.createHash('sha256').update(content).digest('hex');
}
/**
 * Validate domain name
 */
function isValidDomain(domain) {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domain);
}
/**
 * Normalize domain name
 */
function normalizeDomain(domain) {
    return domain.toLowerCase().trim();
}
/**
 * Generate random string
 */
function generateRandomString(length) {
    return crypto.randomBytes(length).toString('hex');
}
/**
 * Hash email address for privacy
 */
function hashEmail(email) {
    return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
}
/**
 * Check if email is disposable
 */
function isDisposableEmail(email) {
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
class RateLimiter {
    constructor(maxRequests = 100, windowMs = 60000) {
        this.requests = new Map();
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }
    isAllowed(identifier) {
        const now = Date.now();
        const windowStart = now - this.windowMs;
        if (!this.requests.has(identifier)) {
            this.requests.set(identifier, [now]);
            return true;
        }
        const requests = this.requests.get(identifier);
        const validRequests = requests.filter(time => time > windowStart);
        if (validRequests.length >= this.maxRequests) {
            return false;
        }
        validRequests.push(now);
        this.requests.set(identifier, validRequests);
        return true;
    }
    getRemainingRequests(identifier) {
        const now = Date.now();
        const windowStart = now - this.windowMs;
        if (!this.requests.has(identifier)) {
            return this.maxRequests;
        }
        const requests = this.requests.get(identifier);
        const validRequests = requests.filter(time => time > windowStart);
        return Math.max(0, this.maxRequests - validRequests.length);
    }
}
exports.RateLimiter = RateLimiter;
//# sourceMappingURL=helpers.js.map