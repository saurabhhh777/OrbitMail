export interface EmailData {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
    cc?: string[];
    bcc?: string[];
    attachments?: EmailAttachment[];
}
export interface EmailAttachment {
    filename: string;
    content: Buffer;
    contentType: string;
}
export interface SMTPConfig {
    host: string;
    port: number;
    secure: boolean;
    auth?: {
        user: string;
        pass: string;
    };
    domain: string;
}
export interface DomainConfig {
    domain: string;
    mxRecords: string[];
    smtpConfig: SMTPConfig;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface EmailJob {
    id: string;
    email: EmailData;
    domainConfig: DomainConfig;
    status: 'pending' | 'processing' | 'sent' | 'failed' | 'retry';
    retries: number;
    maxRetries: number;
    createdAt: Date;
    sentAt?: Date;
    error?: string;
}
export interface DNSRecord {
    type: string;
    name: string;
    value: string;
    priority?: number;
}
export interface EmailAuthResult {
    spf: boolean;
    dkim: boolean;
    dmarc: boolean;
    overall: boolean;
}
export interface EmailAnalytics {
    sent: number;
    delivered: number;
    failed: number;
    bounced: number;
    opened: number;
    clicked: number;
}
export interface QueueStats {
    total: number;
    pending: number;
    processing: number;
    sent: number;
    failed: number;
    retry: number;
}
export interface SMTPResponse {
    code: number;
    message: string;
}
export interface SMTPConnection {
    socket: any;
    host: string;
    port: number;
    secure: boolean;
    authenticated: boolean;
}
export interface MXRecord {
    priority: number;
    exchange: string;
}
export interface DNSResolutionResult {
    mxRecords: MXRecord[];
    spfRecord?: string;
    dkimRecord?: string;
    dmarcRecord?: string;
}
export interface SPFResult {
    result: 'pass' | 'fail' | 'neutral' | 'softfail' | 'temperror' | 'permerror' | 'none';
    explanation?: string;
}
export interface DKIMResult {
    result: 'pass' | 'fail' | 'neutral' | 'policy' | 'temperror' | 'permerror' | 'none';
    signature?: string;
}
export interface DMARCResult {
    result: 'pass' | 'fail' | 'neutral' | 'policy' | 'temperror' | 'permerror' | 'none';
    policy?: string;
}
export declare class EmailError extends Error {
    code: string;
    statusCode: number;
    constructor(message: string, code: string, statusCode?: number);
}
export declare class SMTPError extends EmailError {
    smtpCode: number;
    constructor(message: string, smtpCode: number);
}
export declare class DNSError extends EmailError {
    constructor(message: string);
}
export declare class AuthenticationError extends EmailError {
    constructor(message: string);
}
//# sourceMappingURL=index.d.ts.map