# 🏗️ OrbitMail Architecture Summary

## 📋 **Machine Requirements**

### **Production Deployment:**
```
1. EC2 Instance (Ubuntu 22.04 LTS)
   ├── Type: t3.medium (2 vCPU, 4 GB RAM)
   ├── Storage: 20 GB SSD
   ├── Purpose: All backend services
   └── Cost: ~$30/month

2. Vercel (Frontend)
   ├── Free tier
   ├── Purpose: React frontend hosting
   └── Cost: Free

3. MongoDB Atlas (Database)
   ├── Free tier
   ├── Purpose: Application data storage
   └── Cost: Free
```

## 🏗️ **Single EC2 Architecture (RECOMMENDED)**

### **Folder Structure on EC2:**
```
/opt/orbitmail/
├── express-server/          # Main API Server (Port 7000)
│   ├── dist/
│   ├── node_modules/
│   ├── package.json
│   └── .env
├── smtp-server/            # SMTP Server (Port 2525)
│   ├── index.js
│   ├── node_modules/
│   ├── package.json
│   └── .env
└── email-service/          # Email Service Library
    ├── dist/
    ├── node_modules/
    ├── package.json
    └── .env
```

### **Service Configuration:**
```
1. Express Server (Main Application)
   ├── Port: 7000
   ├── Purpose: User management, domain management, email operations
   ├── Service: orbitmail-express.service
   └── Command: node dist/index.js

2. SMTP Server (Email Receiver)
   ├── Port: 2525
   ├── Purpose: Handle incoming emails
   ├── Service: orbitmail-smtp.service
   └── Command: node index.js

3. Email Service (Library)
   ├── Purpose: Custom email sending logic
   ├── Integration: Within Express server
   └── No separate port needed
```

## 🔧 **Current Working Setup**

### **Local Development:**
```bash
# Email Service (Library)
cd emailservice/
npm run build

# Express Server (Main Application)
cd expresserver/
npm run build
npm run dev  # Runs on port 7000

# SMTP Server (Email Receiver)
cd smtpserver/
npm run dev  # Runs on port 2525

# Frontend
cd frontend/
npm run dev  # Runs on port 5173
```

### **Production Deployment:**
```bash
# EC2 Instance Setup
ssh -i your-key.pem ubuntu@your-ec2-ip
curl -fsSL https://raw.githubusercontent.com/your-repo/main/deployment/ec2-setup.sh | bash

# Configure Environment Variables
sudo nano /opt/orbitmail/express-server/.env
sudo nano /opt/orbitmail/smtp-server/.env

# Start Services
sudo systemctl start orbitmail-express
sudo systemctl start orbitmail-smtp
sudo systemctl enable orbitmail-express
sudo systemctl enable orbitmail-smtp
```

## 🚀 **CI/CD Pipeline**

### **Deployment Triggers:**
```yaml
# Frontend Changes
on: paths: ['frontend/**']
→ Deploy to Vercel

# Express Server Changes
on: paths: ['expresserver/**']
→ Deploy Express Server to EC2 (Port 7000)

# SMTP Server Changes
on: paths: ['smtpserver/**']
→ Deploy SMTP Server to EC2 (Port 2525)

# Email Service Changes
on: paths: ['emailservice/**']
→ Deploy Express Server to EC2 (with updated email service)
```

## 🔍 **Service Communication**

### **Internal Communication:**
```
Frontend (Vercel) → Express Server (EC2:7000)
    ↓
Express Server (EC2:7000) → Email Service (Library)
    ↓
Express Server (EC2:7000) → SMTP Server (EC2:2525)
    ↓
Database (MongoDB Atlas)
```

### **External Communication:**
```
Email Clients → SMTP Server (EC2:2525)
Express Server (EC2:7000) → Email Service (Library)
Frontend (Vercel) → Express Server (EC2:7000)
```

## 🎯 **Why Single EC2 Architecture?**

### **✅ Benefits:**
1. **Cost-Effective**: Single machine, lower costs
2. **Simple Deployment**: One server to manage
3. **Easy Debugging**: All services in one place
4. **Perfect for Demo**: Easy to demonstrate
5. **Resource Efficient**: Shared memory and configuration

### **✅ Perfect for Final Year Project:**
1. **Shows Library Design**: Email service as reusable library
2. **Demonstrates CI/CD**: Automated deployment pipeline
3. **Production Ready**: Can be deployed to real infrastructure
4. **Easy to Understand**: Clear service boundaries
5. **Cost Effective**: Minimal infrastructure costs

## 📊 **Resource Requirements**

### **Minimum (Development):**
```
EC2 Instance: t3.micro
├── CPU: 1 vCPU
├── RAM: 1 GB
├── Storage: 8 GB SSD
└── Cost: ~$8/month
```

### **Recommended (Production):**
```
EC2 Instance: t3.medium
├── CPU: 2 vCPUs
├── RAM: 4 GB
├── Storage: 20 GB SSD
└── Cost: ~$30/month
```

## 🔧 **Current Status**

### **✅ Working Components:**
1. **Express Server**: ✅ Running on port 7000
2. **Email Service**: ✅ Built and integrated as library
3. **SMTP Server**: ✅ Ready for deployment
4. **Frontend**: ✅ Ready for Vercel deployment
5. **Admin Authentication**: ✅ Complete with role-based access
6. **CI/CD Pipeline**: ✅ Configured for all services

### **✅ Tested Features:**
1. **Health Check**: ✅ `GET /health` returns server status
2. **Database Connection**: ✅ MongoDB Atlas connected
3. **Email Service Integration**: ✅ Library imported successfully
4. **Admin Authentication**: ✅ Separate admin login and routes

## 🚀 **Next Steps**

### **1. Deploy to Production:**
```bash
# 1. Launch EC2 instance
# 2. Run setup script
# 3. Configure environment variables
# 4. Start services
# 5. Deploy frontend to Vercel
```

### **2. Test All Features:**
```bash
# 1. Test user registration/login
# 2. Test admin authentication
# 3. Test domain management
# 4. Test email sending
# 5. Test payment integration
```

### **3. Monitor Performance:**
```bash
# 1. Check service logs
# 2. Monitor resource usage
# 3. Test email delivery
# 4. Verify admin dashboard
```

## 🎉 **Summary**

### **Architecture Decision:**
- ✅ **Single EC2 Instance** for all backend services
- ✅ **Email Service as Library** within Express server
- ✅ **SMTP Server** for incoming email handling
- ✅ **Frontend on Vercel** for static hosting
- ✅ **Database on MongoDB Atlas** for data persistence

### **Deployment Strategy:**
- ✅ **Path-based CI/CD** triggers for each service
- ✅ **Email service changes** deploy Express server
- ✅ **Automatic health checks** and rollback
- ✅ **Environment-specific** configuration

### **Perfect for Final Year Project:**
- ✅ **Advanced Concepts**: Library design, CI/CD, microservices
- ✅ **Production Ready**: Can be deployed to real infrastructure
- ✅ **Cost Effective**: Minimal infrastructure costs
- ✅ **Easy to Demonstrate**: Clear service boundaries
- ✅ **Scalable**: Can be extended with more services

**🚀 Your OrbitMail platform is now ready for production deployment with a clean, efficient, and cost-effective architecture!** 