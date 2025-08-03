# 🚀 OrbitMail Deployment Architecture

## 📋 **RECOMMENDED: Single EC2 Architecture**

### **Machine Requirements:**
```
1. EC2 Instance (Ubuntu 22.04 LTS)
   - Type: t3.medium (2 vCPU, 4 GB RAM)
   - Storage: 20 GB SSD
   - Purpose: Run all backend services

2. Vercel (Frontend)
   - Free tier
   - Purpose: Host React frontend

3. MongoDB Atlas (Database)
   - Free tier
   - Purpose: Store application data
```

## 🏗️ **Single EC2 Architecture (RECOMMENDED)**

### **EC2 Instance Structure:**
```
EC2 Instance (Single Machine)
├── Express Server (Port 3000)
│   ├── User Management
│   ├── Domain Management
│   ├── Email Operations
│   └── Email Service (Library)
├── SMTP Server (Port 2525)
│   └── Incoming Email Handler
└── Email Service (Port 3001) - Optional
    └── Standalone Email Service
```

### **Folder Structure on EC2:**
```
/opt/orbitmail/
├── express-server/          # Express Server
│   ├── dist/
│   ├── node_modules/
│   ├── package.json
│   └── .env
├── smtp-server/            # SMTP Server
│   ├── index.js
│   ├── node_modules/
│   ├── package.json
│   └── .env
└── email-service/          # Email Service (Optional)
    ├── dist/
    ├── node_modules/
    ├── package.json
    └── .env
```

## 🔧 **Service Configuration**

### **1. Express Server (Main Application)**
```bash
# Location: /opt/orbitmail/express-server/
# Port: 3000
# Purpose: Main API server, user management, domain management

# Service File: orbitmail-express.service
# Command: node dist/index.js
```

### **2. SMTP Server (Email Receiver)**
```bash
# Location: /opt/orbitmail/smtp-server/
# Port: 2525
# Purpose: Handle incoming emails

# Service File: orbitmail-smtp.service
# Command: node index.js
```

### **3. Email Service (Optional Standalone)**
```bash
# Location: /opt/orbitmail/email-service/
# Port: 3001
# Purpose: Standalone email service (if needed)

# Service File: orbitmail-email.service
# Command: node dist/index.js
```

## 🚀 **Deployment Strategy**

### **Option A: Library Integration (RECOMMENDED)**
```
Express Server imports Email Service as library
├── Express Server (Port 3000)
│   └── Email Service (Library within Express)
└── SMTP Server (Port 2525)
```

**Benefits:**
- ✅ Single deployment unit
- ✅ Shared memory and configuration
- ✅ Easier debugging
- ✅ Lower resource usage

### **Option B: Microservice Architecture (COMPLEX)**
```
Separate services on same machine
├── Express Server (Port 3000)
├── Email Service (Port 3001)
└── SMTP Server (Port 2525)
```

**Benefits:**
- ✅ Service isolation
- ✅ Independent scaling
- ❌ More complex deployment
- ❌ Higher resource usage

## 📦 **CI/CD Pipeline**

### **Current Setup (RECOMMENDED):**
```yaml
# Frontend Changes
on: paths: ['frontend/**']
→ Deploy to Vercel

# Express Server Changes
on: paths: ['expresserver/**']
→ Deploy Express Server to EC2

# SMTP Server Changes
on: paths: ['smtpserver/**']
→ Deploy SMTP Server to EC2

# Email Service Changes
on: paths: ['emailservice/**']
→ Deploy Express Server to EC2 (with updated email service)
```

## 🔧 **Setup Instructions**

### **Step 1: Launch EC2 Instance**
```bash
# Instance Type: t3.medium
# OS: Ubuntu 22.04 LTS
# Security Group: Allow ports 22, 80, 443, 3000, 2525, 3001
```

### **Step 2: Run Setup Script**
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Run setup script
curl -fsSL https://raw.githubusercontent.com/your-repo/main/deployment/ec2-setup.sh | bash
```

### **Step 3: Configure Services**
```bash
# Express Server
sudo nano /opt/orbitmail/express-server/.env

# SMTP Server
sudo nano /opt/orbitmail/smtp-server/.env

# Email Service (if using standalone)
sudo nano /opt/orbitmail/email-service/.env
```

### **Step 4: Start Services**
```bash
# Start all services
sudo systemctl start orbitmail-express
sudo systemctl start orbitmail-smtp
sudo systemctl start orbitmail-email  # Optional

# Enable auto-start
sudo systemctl enable orbitmail-express
sudo systemctl enable orbitmail-smtp
sudo systemctl enable orbitmail-email  # Optional
```

## 📊 **Resource Requirements**

### **Minimum Requirements:**
```
EC2 Instance: t3.medium
├── CPU: 2 vCPUs
├── RAM: 4 GB
├── Storage: 20 GB SSD
└── Network: 5 Gbps
```

### **Recommended Requirements:**
```
EC2 Instance: t3.large
├── CPU: 2 vCPUs
├── RAM: 8 GB
├── Storage: 50 GB SSD
└── Network: 5 Gbps
```

## 🔍 **Service Communication**

### **Internal Communication:**
```
Express Server (3000) ←→ SMTP Server (2525)
    ↓
Email Service (Library within Express)
    ↓
Database (MongoDB Atlas)
```

### **External Communication:**
```
Frontend (Vercel) → Express Server (3000)
Email Clients → SMTP Server (2525)
Express Server (3000) → Email Service (Library)
```

## 🎯 **Recommended Architecture**

### **For Your Final Year Project:**
```
✅ Single EC2 Instance
├── Express Server (Port 3000)
│   └── Email Service (Library)
├── SMTP Server (Port 2525)
└── Frontend (Vercel)

✅ Benefits:
├── Simple deployment
├── Easy debugging
├── Cost-effective
├── Perfect for demonstration
└── Easy to understand
```

## 🚨 **Current Issue Fix**

The error you're seeing is because the email service hasn't been built. Here's the fix:

```bash
# 1. Build email service
cd /home/sa/Desktop/sa/OrbitMail/emailservice
npm run build

# 2. Build Express server
cd /home/sa/Desktop/sa/OrbitMail/expresserver
npm run build

# 3. Start Express server
npm run dev
```

## 📋 **Summary**

### **Machine Requirements:**
1. **1 EC2 Instance** (t3.medium) - All backend services
2. **Vercel** (Free) - Frontend hosting
3. **MongoDB Atlas** (Free) - Database

### **Folder Deployment:**
- **expresserver/** → EC2 (Port 3000)
- **smtpserver/** → EC2 (Port 2525)
- **emailservice/** → Library within Express Server
- **frontend/** → Vercel

### **Service Architecture:**
```
Frontend (Vercel) → Express Server (EC2:3000) → Email Service (Library) → SMTP Server (EC2:2525)
```

**🎉 This architecture is perfect for your final year project - simple, cost-effective, and easy to demonstrate!** 