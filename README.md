# OrbitMail - Professional Email Platform

OrbitMail is a powerful, easy-to-use platform that lets users create and manage professional email addresses on their own custom domains. Whether you own saurabh.com or any other domain, OrbitMail enables you to set up emails like founder@saurabh.com, team@yourstartup.com, or any personalized address — all without relying on Gmail or third-party providers.

## ✨ Features

- 🛠️ **Custom Email Creation** – Instantly create email addresses like you@yourdomain.com
- 📬 **Send & Receive Emails** – Full email functionality with both inbound and outbound support
- 🌐 **Domain-Based Identity** – Build trust with professional, branded email addresses
- 🔐 **Privacy & Control** – All emails are handled on OrbitMail's secure, self-managed servers
- 💻 **Clean, Modern UI** – Easy-to-use dashboard for managing inboxes and sending messages
- 🔍 **MX Record Verification** – Automatic verification of domain MX records
- 📧 **Email Storage** – Secure storage and retrieval of all emails
- 🔐 **OAuth Authentication** – Sign in with Google, GitHub, or Apple
- 💳 **Subscription Management** – Free tier (2 emails) and paid plans (5-10 emails)
- 💰 **Razorpay Integration** – Secure payment processing for subscriptions
- 🚀 **Custom Email Service** – Built-from-scratch email infrastructure with SMTP client, DNS resolution, and queue management

## 📦 Use Cases

- **Startups & Teams** – Create role-based emails like support@, founder@, team@, etc.
- **Personal Branding** – Use your own domain for a professional presence
- **Developers** – Test and manage email flow for custom domains

## 🏗️ Architecture

The application consists of four main components:

1. **Express Server** (`expresserver/`) - Main API server handling user management, domain management, and email operations
2. **SMTP Server** (`smtpserver/`) - Handles incoming and outgoing email traffic
3. **Frontend** (`frontend/`) - React-based user interface
4. **Email Service** (`emailservice/`) - Custom email infrastructure built from scratch

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saurabhhh777/OrbitMail.git
   cd OrbitMail
   ```

2. **Install dependencies for all services**
   ```bash
   # Express Server
   cd expresserver
   npm install
   cp env.example .env
   # Edit .env with your configuration
   
   # SMTP Server
   cd ../smtpserver
   npm install
   cp env.example .env
   # Edit .env with your configuration
   
   # Email Service
   cd ../emailservice
   npm install
   cp env.example .env
   # Edit .env with your configuration
   
   # Frontend
   cd ../frontend
   npm install
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Configure Environment Variables**

   **Express Server** (`expresserver/.env`):
   ```env
   MONGODB_URL=mongodb://localhost:27017/orbitmail
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```

   **SMTP Server** (`smtpserver/.env`):
   ```env
   SMTP_PORT=2525
   EXPRESS_URL=http://localhost:3000
   ```

   **Email Service** (`emailservice/.env`):
   ```env
   EMAIL_SERVICE_PORT=3001
   EXPRESS_URL=http://localhost:3000
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_EXPRESS_URL=http://localhost:3000/api
   ```

4. **Start the services**
   ```bash
   # Terminal 1: Express Server
   cd expresserver
   npm run dev
   
   # Terminal 2: SMTP Server
   cd smtpserver
   npm start
   
   # Terminal 3: Email Service (optional - for custom email sending)
   cd emailservice
   npm run dev
   
   # Terminal 4: Frontend
   cd frontend
   npm run dev
   ```

## 🔧 Custom Email Service

The email service provides a complete email infrastructure built from scratch:

### **Features:**
- **Custom SMTP Client**: Raw TCP/TLS implementation
- **DNS Resolution**: MX record lookup and domain verification
- **Email Queue**: Background processing with retry logic
- **Authentication**: SPF, DKIM, DMARC validation
- **Rate Limiting**: Built-in rate limiting for email sending

### **Usage:**
```typescript
import { OrbitMailEmailService } from './emailservice/dist/index';

const emailService = new OrbitMailEmailService();

// Add domain
await emailService.addDomain('example.com', ['mx1.example.com']);

// Send email
const jobId = await emailService.sendFromDomain(
  'user@example.com',
  'recipient@gmail.com',
  'Test Subject',
  'Hello, this is a test email!'
);
```

## 📊 API Endpoints

### **Authentication**
- `POST /api/v1/user/signup` - User registration
- `POST /api/v1/user/signin` - User login
- `POST /api/v1/user/signout` - User logout
- `GET /api/v1/user/check-status` - Check authentication status

### **Domain Management**
- `POST /api/v1/userdomain/add` - Add new domain
- `GET /api/v1/userdomain/all` - Get user domains
- `POST /api/v1/userdomain/verify` - Verify domain MX records
- `POST /api/v1/userdomain/:id/emails` - Add email prefix
- `DELETE /api/v1/userdomain/:id/emails/:prefix` - Remove email prefix

### **Email Operations**
- `POST /api/v1/email/send` - Send email
- `POST /api/v1/email/get` - Get user emails
- `GET /api/v1/email/analytics` - Get email analytics
- `GET /api/v1/email/service/status` - Get email service status
- `GET /api/v1/email/job/:jobId` - Get email job status

### **Payment & Subscription**
- `GET /api/v1/payment/plans` - Get subscription plans
- `POST /api/v1/payment/create-order` - Create payment order
- `POST /api/v1/payment/verify` - Verify payment

### **Admin (Protected)**
- `GET /api/v1/admin/dashboard` - Admin dashboard
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/domains` - Get all domains
- `GET /api/v1/admin/email-analytics` - Platform email analytics

## 🛠️ Development

### **Project Structure**
```
OrbitMail/
├── expresserver/          # Main API server
├── smtpserver/           # SMTP server for email handling
├── emailservice/         # Custom email infrastructure
├── frontend/             # React frontend
└── README.md
```

### **Building for Production**
```bash
# Express Server
cd expresserver
npm run build

# Email Service
cd emailservice
npm run build

# Frontend
cd frontend
npm run build
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **OAuth Integration**: Google, GitHub, Apple sign-in
- **Email Authentication**: SPF, DKIM, DMARC validation
- **Rate Limiting**: Prevent abuse and spam
- **Input Validation**: Comprehensive validation throughout

## 📈 Monitoring

- **Email Queue**: Monitor email processing status
- **Service Health**: Health check endpoints
- **Analytics**: Email sending/receiving analytics
- **Admin Dashboard**: Platform-wide monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for Professional Email Management** 