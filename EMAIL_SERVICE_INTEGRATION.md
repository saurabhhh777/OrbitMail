# 📧 Email Service Integration Guide

## 🏗️ **Architecture Overview**

### **Current Setup:**
```
OrbitMail/
├── expresserver/          # Main API server
│   ├── controllers/       # Business logic
│   ├── services/          # Email service integration
│   └── routes/           # API endpoints
├── emailservice/          # Custom email infrastructure
│   ├── src/              # Email service source code
│   └── dist/             # Compiled JavaScript
├── smtpserver/           # SMTP server for incoming emails
└── frontend/             # React frontend
```

## 🔄 **How Express Server Interacts with Email Service**

### **1. Library Integration (Current Approach)**

The email service is **NOT a separate backend**. It's a **library/module** that runs within the Express server process.

```typescript
// expresserver/controllers/email.controller.ts
import emailServiceManager from '../services/emailService';

export const sendEmail = async (req: Request, res: Response) => {
  // 1. Store email in database
  await emailSentReceiveModel.create({ to, from, subject, text });
  
  // 2. Send email using email service
  const jobId = await emailServiceManager.sendEmail(from, to, subject, text);
  
  // 3. Return response
  res.json({ success: true, jobId });
};
```

### **2. Process Flow:**

```
Frontend Request
    ↓
Express Server (expresserver/)
    ↓
Email Controller
    ↓
Email Service Manager (services/emailService.ts)
    ↓
Custom Email Service (emailservice/dist/index.js)
    ↓
SMTP Client → DNS Resolution → Email Queue
```

### **3. Single Process Architecture:**

```
Node.js Process
├── Express Server
│   ├── User Management
│   ├── Domain Management
│   └── Email Operations
├── Email Service (Library)
│   ├── SMTP Client
│   ├── DNS Resolution
│   └── Email Queue
└── Database Connections
```

## 📋 **Detailed Integration Points**

### **1. Email Service Manager (`expresserver/services/emailService.ts`)**

```typescript
// Singleton pattern for email service
class EmailServiceManager {
  private emailService: OrbitMailEmailService;

  public async sendEmail(from: string, to: string, subject: string, text: string): Promise<string> {
    return await this.emailService.sendFromDomain(from, to, subject, text);
  }
}
```

### **2. Email Controller (`expresserver/controllers/email.controller.ts`)**

```typescript
export const sendEmail = async (req: Request, res: Response) => {
  // 1. Validate input
  // 2. Store in database
  // 3. Send via email service
  const jobId = await emailServiceManager.sendEmail(from, to, subject, text);
  // 4. Return response
};
```

### **3. API Endpoints (`expresserver/routes/email.route.ts`)**

```typescript
router.post("/send", userAuth, sendEmail as any);
router.get("/service/status", getEmailServiceStatus as any);
router.get("/job/:jobId", getEmailJobStatus as any);
```

## 🚀 **Benefits of Current Architecture**

### **✅ Advantages:**
1. **Simple Deployment**: Single process, easier to deploy
2. **Shared Memory**: Email service can access Express server data
3. **No Network Overhead**: Direct function calls, no HTTP requests
4. **Easier Debugging**: All code runs in same process
5. **Shared Configuration**: Same environment variables

### **✅ Perfect for Final Year Project:**
1. **Shows Library Design**: Custom email service as reusable library
2. **Modular Architecture**: Clean separation of concerns
3. **Production Ready**: Can be deployed as single service
4. **Easy to Understand**: Clear integration points

## 🔧 **Alternative Architectures (For Reference)**

### **Option 1: Separate Microservice**
```typescript
// Express server makes HTTP calls
const response = await axios.post('http://localhost:3001/api/email/send', {
  from, to, subject, text
});
```

### **Option 2: Message Queue**
```typescript
// Express server publishes to queue
await queue.publish('email.send', { from, to, subject, text });
// Email service consumes from queue
```

### **Option 3: Shared Library (Current - Recommended)**
```typescript
// Direct function calls
const jobId = await emailServiceManager.sendEmail(from, to, subject, text);
```

## 📊 **Current Implementation Details**

### **1. Email Service Components:**
- **SMTP Client**: Raw TCP/TLS implementation
- **DNS Resolution**: MX record lookup
- **Email Queue**: Background processing
- **Authentication**: SPF, DKIM, DMARC

### **2. Integration Points:**
- **Database**: Emails stored in MongoDB
- **Queue**: Background email processing
- **DNS**: Domain verification
- **SMTP**: Actual email sending

### **3. Error Handling:**
```typescript
try {
  const jobId = await emailServiceManager.sendEmail(from, to, subject, text);
  // Success
} catch (emailError) {
  // Email service failed, but email is stored in database
  // Return success with "delayed" message
}
```

## 🎯 **Answer to Your Questions:**

### **1. Is Email Service a Separate Backend?**
**Answer: NO** - The email service is a **library/module** that runs within the Express server process.

### **2. How Does Express Server Interact?**
**Answer:** Through direct function calls using the Email Service Manager.

### **3. Where Does Code Run?**
**Answer:** All code runs through the Express server folder. The email service is imported as a library.

## 🚀 **Deployment Architecture:**

```
Production Server
├── Node.js Process
│   ├── Express Server (Port 3000)
│   │   ├── API Endpoints
│   │   ├── Email Service (Library)
│   │   └── Database Connections
│   └── SMTP Server (Port 2525)
└── Frontend (Port 5173)
```

## 📈 **Monitoring & Health Checks:**

```typescript
// Check email service status
GET /api/v1/email/service/status

// Check email job status
GET /api/v1/email/job/:jobId

// Check queue statistics
GET /api/v1/email/queue/stats
```

## 🎉 **Summary:**

**✅ Current Architecture is Perfect for Your Project:**

1. **Email Service**: Custom library built from scratch
2. **Integration**: Direct function calls (no HTTP overhead)
3. **Deployment**: Single process, easy to deploy
4. **Development**: Clear separation, easy to understand
5. **Production**: Scalable and maintainable

**🚀 Your email service integration is working perfectly!** 