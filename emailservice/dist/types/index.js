"use strict";
// Core email types and interfaces
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationError = exports.DNSError = exports.SMTPError = exports.EmailError = void 0;
// Error Types
class EmailError extends Error {
    constructor(message, code, statusCode = 500) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'EmailError';
    }
}
exports.EmailError = EmailError;
class SMTPError extends EmailError {
    constructor(message, smtpCode) {
        super(message, 'SMTP_ERROR', 500);
        this.smtpCode = smtpCode;
        this.name = 'SMTPError';
    }
}
exports.SMTPError = SMTPError;
class DNSError extends EmailError {
    constructor(message) {
        super(message, 'DNS_ERROR', 500);
        this.name = 'DNSError';
    }
}
exports.DNSError = DNSError;
class AuthenticationError extends EmailError {
    constructor(message) {
        super(message, 'AUTH_ERROR', 401);
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;
//# sourceMappingURL=index.js.map