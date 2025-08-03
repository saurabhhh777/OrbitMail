# OrbitMail Email Service

A custom email sending service built from scratch for the OrbitMail SaaS platform. This service implements complete email infrastructure including SMTP client, DNS resolution, email queuing, and authentication validation.

## 🚀 Features

### **Core Email Functionality**
- ✅ **Custom SMTP Client**: Built from scratch using raw TCP/TLS
- ✅ **DNS Resolution**: MX record lookup and domain verification
- ✅ **Email Queue System**: Background processing with retry logic
- ✅ **Authentication**: SPF, DKIM, and DMARC validation
- ✅ **Rate Limiting**: Built-in rate limiting for email sending
- ✅ **Error Handling**: Comprehensive error handling and logging

### **Advanced Features**
- ✅ **Domain Management**: Add, verify, and manage custom domains
- ✅ **Email Analytics**: Track sent, delivered, failed emails
- ✅ **Queue Management**: Monitor and manage email queue
- ✅ **Authentication Records**: Generate SPF, DKIM, DMARC records
- ✅ **Multi-threading**: Background processing with job management

## 📁 Project Structure

```
emailservice/
├── src/
│   ├── types/           # TypeScript interfaces and types
│   ├── smtp/            # Custom SMTP client implementation
│   ├── dns/             # DNS resolution and domain verification
│   ├── queue/           # Email queue system with retry logic
│   ├── auth/            # Email authentication (SPF, DKIM, DMARC)
│   ├── utils/           # Helper functions and utilities
│   └── index.ts         # Main service orchestrator
├── tests/               # Unit tests
├── docs/                # Documentation
├── package.json
└── tsconfig.json
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Start development
npm run dev
```

## 📖 Usage

### **Basic Email Service Setup**

```typescript
import { OrbitMailEmailService } from './dist/index';

// Initialize the email service
const emailService = new OrbitMailEmailService();

// Add a domain
await emailService.addDomain('example.com', ['mx1.example.com', 'mx2.example.com']);

// Send email from custom domain
const jobId = await emailService.sendFromDomain(
  'user@example.com',
  'recipient@gmail.com',
  'Test Subject',
  'Hello, this is a test email!'
);

// Check job status
const jobStatus = emailService.getJobStatus(jobId);
console.log('Job status:', jobStatus);
```

### **Domain Management**

```typescript
// Add domain with verification
await emailService.addDomain('mycompany.com', ['mail.mycompany.com']);

// Verify domain configuration
const isValid = await emailService.verifyDomain('mycompany.com');

// Get domain DNS information
const dnsInfo = await emailService.getDomainDNSInfo('mycompany.com');
console.log('MX Records:', dnsInfo.mxRecords);
console.log('SPF Record:', dnsInfo.spfRecord);
```

### **Email Queue Management**

```typescript
// Get queue statistics
const stats = emailService.getQueueStats();
console.log('Queue stats:', stats);

// Get all jobs
const allJobs = emailService.getAllJobs();

// Get jobs by status
const failedJobs = emailService.getJobsByStatus('failed');

// Retry failed jobs
const retryCount = emailService.retryFailedJobs();

// Clear completed jobs
const clearedCount = emailService.clearCompletedJobs();
```

### **Direct SMTP Client Usage**

```typescript
import { CustomSMTPClient } from './dist/smtp/client';

const smtpClient = new CustomSMTPClient();

// Connect to SMTP server
await smtpClient.connect('smtp.gmail.com', 587, true);

// Authenticate (if required)
await smtpClient.authenticate('username', 'password');

// Send email
await smtpClient.sendEmail({
  from: 'sender@example.com',
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'Hello, this is a test email!'
});

// Disconnect
await smtpClient.disconnect();
```

### **DNS Resolution**

```typescript
import { DNSResolver } from './dist/dns/resolver';

const dnsResolver = new DNSResolver();

// Resolve MX records
const mxRecords = await dnsResolver.resolveMX('example.com');

// Get best MX server
const bestServer = await dnsResolver.getBestMXServer('example.com');

// Complete domain resolution
const resolution = await dnsResolver.resolveDomain('example.com');
console.log('DNS Resolution:', resolution);
```

### **Email Authentication**

```typescript
import { EmailAuth } from './dist/auth/validator';

const emailAuth = new EmailAuth();

// Validate SPF
const spfResult = emailAuth.validateSPF(spfRecord, clientIP, senderDomain);

// Validate DKIM
const dkimResult = emailAuth.validateDKIM(dkimRecord, emailHeaders, signature);

// Validate DMARC
const dmarcResult = emailAuth.validateDMARC(dmarcRecord, spfResult, dkimResult);

// Complete authentication validation
const authResult = emailAuth.validateEmailAuth(
  spfRecord,
  dkimRecord,
  dmarcRecord,
  clientIP,
  senderDomain,
  emailHeaders,
  signature
);
```

## 🔧 Configuration

### **Environment Variables**

Create a `.env` file in the emailservice directory:

```env
# Email Service Configuration
EMAIL_SERVICE_PORT=3001
EMAIL_SERVICE_HOST=localhost

# Queue Configuration
MAX_RETRIES=3
RETRY_DELAY=5000
PROCESSING_INTERVAL=1000

# Rate Limiting
MAX_REQUESTS_PER_MINUTE=100
RATE_LIMIT_WINDOW=60000

# DNS Configuration
DNS_TIMEOUT=10000
DNS_RETRIES=3

# SMTP Configuration
SMTP_TIMEOUT=30000
SMTP_MAX_CONNECTIONS=10
```

### **Service Configuration**

```typescript
// Configure email service
const emailService = new OrbitMailEmailService();

// Set queue configuration
emailService.setMaxRetries(5);
emailService.setRetryDelay(10000);
emailService.setProcessingInterval(2000);
```

## 🧪 Testing

### **Unit Tests**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --testNamePattern="SMTP Client"
```

### **Integration Tests**

```typescript
// Test email sending
const testResult = await emailService.testDomainEmail(
  'example.com',
  'test@example.com'
);

// Test domain verification
const verificationResult = await emailService.verifyDomain('example.com');
```

## 📊 Monitoring

### **Service Status**

```typescript
const status = emailService.getStatus();
console.log('Service Status:', status);
// Output:
// {
//   domains: 5,
//   queueSize: 12,
//   isProcessing: true,
//   queueStats: {
//     total: 12,
//     pending: 8,
//     processing: 2,
//     sent: 100,
//     failed: 2,
//     retry: 0
//   }
// }
```

### **Queue Statistics**

```typescript
const stats = emailService.getQueueStats();
console.log('Queue Statistics:', stats);
```

## 🔒 Security Features

### **Rate Limiting**
- Built-in rate limiting per domain/IP
- Configurable limits and windows
- Automatic throttling

### **Email Authentication**
- SPF record validation
- DKIM signature verification
- DMARC policy enforcement

### **Input Validation**
- Email format validation
- Domain name validation
- Content size limits

## 🚀 Performance

### **Optimizations**
- Connection pooling for SMTP
- Background queue processing
- Efficient DNS caching
- Memory-efficient job management

### **Scalability**
- Horizontal scaling support
- Queue-based architecture
- Stateless design
- Load balancing ready

## 🔧 Integration with OrbitMail Backend

### **Express Server Integration**

```typescript
// In your Express server
import { OrbitMailEmailService } from '../emailservice/dist/index';

const emailService = new OrbitMailEmailService();

// Add to your email controller
export const sendEmail = async (req: Request, res: Response) => {
  try {
    const { from, to, subject, text } = req.body;
    
    const jobId = await emailService.sendFromDomain(from, to, subject, text);
    
    res.json({
      success: true,
      jobId,
      message: 'Email queued for sending'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
```

## 📈 Advanced Usage

### **Custom SMTP Configuration**

```typescript
// Custom SMTP setup
const smtpClient = new CustomSMTPClient();

await smtpClient.sendEmailWithConnection(
  'smtp.example.com',
  587,
  true, // Use TLS
  {
    username: 'user@example.com',
    password: 'password'
  },
  {
    from: 'sender@example.com',
    to: 'recipient@example.com',
    subject: 'Test',
    text: 'Hello!'
  }
);
```

### **Batch Email Processing**

```typescript
// Process multiple emails
const emails = [
  { from: 'user1@example.com', to: 'recipient1@gmail.com', subject: 'Test 1', text: 'Hello 1' },
  { from: 'user2@example.com', to: 'recipient2@gmail.com', subject: 'Test 2', text: 'Hello 2' }
];

const jobIds = await Promise.all(
  emails.map(email => 
    emailService.sendFromDomain(email.from, email.to, email.subject, email.text)
  )
);
```

## 🐛 Troubleshooting

### **Common Issues**

1. **DNS Resolution Failed**
   - Check domain MX records
   - Verify domain configuration
   - Check network connectivity

2. **SMTP Connection Failed**
   - Verify SMTP server settings
   - Check firewall rules
   - Validate authentication credentials

3. **Email Queue Not Processing**
   - Check queue status
   - Verify background processing
   - Review error logs

### **Debug Mode**

```typescript
// Enable debug logging
process.env.DEBUG = 'emailservice:*';

// Or set specific debug flags
process.env.DEBUG = 'emailservice:smtp,emailservice:queue';
```

## 📚 API Reference

### **OrbitMailEmailService**

- `addDomain(domain: string, mxRecords: string[]): Promise<void>`
- `removeDomain(domain: string): boolean`
- `sendFromDomain(from: string, to: string, subject: string, text: string): Promise<string>`
- `sendEmailImmediate(from: string, to: string, subject: string, text: string): Promise<void>`
- `getJobStatus(jobId: string): EmailJob | null`
- `getQueueStats(): QueueStats`
- `verifyDomain(domain: string): Promise<boolean>`
- `getStatus(): ServiceStatus`

### **CustomSMTPClient**

- `connect(host: string, port: number, secure: boolean): Promise<SMTPConnection>`
- `authenticate(username: string, password: string): Promise<void>`
- `sendEmail(email: EmailData): Promise<void>`
- `disconnect(): Promise<void>`
- `sendEmailWithConnection(...): Promise<void>`

### **DNSResolver**

- `resolveMX(domain: string): Promise<MXRecord[]>`
- `resolveDomain(domain: string): Promise<DNSResolutionResult>`
- `verifyDomainEmailConfig(domain: string): Promise<boolean>`
- `getBestMXServer(domain: string): Promise<string | null>`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting guide

---

**Built with ❤️ for OrbitMail SaaS Platform** 