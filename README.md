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

## 📦 Use Cases

- **Startups & Teams** – Create role-based emails like support@, founder@, team@, etc.
- **Personal Branding** – Use your own domain for a professional presence
- **Developers** – Test and manage email flow for custom domains

## 🏗️ Architecture

The application consists of three main components:

1. **Express Server** (`expresserver/`) - Main API server handling user management, domain management, and email operations
2. **SMTP Server** (`smtpserver/`) - Handles incoming and outgoing email traffic
3. **Frontend** (`frontend/`) - React-based user interface

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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
   
   # Terminal 3: Frontend
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Express API: http://localhost:3000
   - SMTP Server: localhost:2525

## 📋 API Endpoints

### Authentication
- `POST /api/v1/user/signup` - User registration
- `POST /api/v1/user/signin` - User login
- `POST /api/v1/user/signout` - User logout
- `GET /api/v1/user/check` - Check authentication status

### OAuth Authentication
- `POST /api/v1/auth/google` - Google OAuth
- `POST /api/v1/auth/github` - GitHub OAuth
- `POST /api/v1/auth/apple` - Apple OAuth

### Domain Management
- `POST /api/v1/userdomain/` - Add new domain
- `GET /api/v1/userdomain/` - Get all user domains
- `POST /api/v1/userdomain/verifymxrec` - Verify domain MX records

### Email Operations
- `POST /api/v1/email/sendEmail` - Send email
- `GET /api/v1/email/getMail` - Get user emails
- `POST /api/v1/email/store` - Store incoming email (SMTP)

### Email Prefix Management
- `POST /api/v1/userdomain/:id/emails` - Add email prefix to domain
- `DELETE /api/v1/userdomain/:id/emails/:prefix` - Remove email prefix
- `GET /api/v1/userdomain/:id/emails` - Get email prefixes for domain
- `GET /api/v1/userdomain/:id/mx-records` - Get MX records for domain

### Payment & Subscription
- `POST /api/v1/payment/create-order` - Create payment order
- `POST /api/v1/payment/verify` - Verify payment
- `GET /api/v1/payment/plans` - Get subscription plans
- `GET /api/v1/payment/subscription` - Get user subscription status

### Admin (Optional)
- `POST /api/v1/admin/signup` - Admin registration
- `POST /api/v1/admin/signin` - Admin login
- `POST /api/v1/admin/signout` - Admin logout

## 🔧 Configuration

### Domain Setup

To use your domain with OrbitMail:

1. **Add your domain** through the dashboard
2. **Configure DNS records**:
   - Add MX records pointing to `mx1.orbitmail.fun` and `mx2.orbitmail.fun`
   - Priority: 10 for mx1, 20 for mx2
3. **Verify your domain** using the dashboard verification tool

### Email Configuration

The SMTP server handles:
- **Incoming emails** - Automatically stored in the database
- **Outgoing emails** - Sent through the SMTP server
- **Authentication** - Based on user credentials

## 🛠️ Development

### Project Structure

```
OrbitMail/
├── expresserver/          # Express API server
│   ├── config/           # Database configuration
│   ├── controllers/      # Business logic
│   ├── middlewares/      # Authentication middleware
│   ├── models/          # MongoDB schemas
│   └── routes/          # API routes
├── smtpserver/          # SMTP server for email handling
├── frontend/            # React frontend
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── store/          # State management
│   └── lib/            # Utilities
└── README.md
```

### Database Schema

**Users**: Basic user authentication
**UserDomains**: Domain management with email addresses
**EmailSentReceive**: Email storage and retrieval
**Admin**: Admin user management

### Key Features Implemented

- ✅ User authentication with JWT
- ✅ Domain management with validation
- ✅ MX record verification
- ✅ Email sending and receiving
- ✅ Secure email storage
- ✅ Modern React frontend
- ✅ SMTP server integration
- ✅ Error handling and validation

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation and sanitization
- Secure cookie handling
- Domain validation

## 🚀 Deployment

### Production Setup

1. **Environment Variables**: Set production values for all services
2. **Database**: Use MongoDB Atlas or self-hosted MongoDB
3. **SMTP**: Configure proper SMTP authentication
4. **Frontend**: Build and serve static files
5. **Reverse Proxy**: Use Nginx for load balancing

### Docker Support (Future)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

---

**OrbitMail** - Professional email management made simple. 