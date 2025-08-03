# 🚀 OrbitMail Deployment Guide

## 📋 **Deployment Architecture**

```
Production Environment:
├── Frontend (Vercel)
│   └── React App (Port 5173)
├── EC2 Instance
│   ├── Express Server (Port 3000)
│   ├── SMTP Server (Port 2525)
│   └── Email Service (Port 3001)
└── MongoDB Atlas (Database)
```

## 🔧 **CI/CD Pipeline Setup**

### **1. GitHub Secrets Configuration**

Add these secrets to your GitHub repository:

#### **Vercel Secrets (for Frontend)**
```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

#### **AWS Secrets (for EC2)**
```bash
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
EC2_SSH_KEY=your_ec2_private_key
EC2_USER=ubuntu
EC2_HOST=your_ec2_public_ip
```

### **2. EC2 Instance Setup**

#### **Step 1: Launch EC2 Instance**
```bash
# Launch Ubuntu 22.04 LTS instance
# Instance Type: t3.medium (2 vCPU, 4 GB RAM)
# Security Group: Allow ports 22, 80, 443, 3000, 2525, 3001
```

#### **Step 2: Run Setup Script**
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Run setup script
curl -fsSL https://raw.githubusercontent.com/your-repo/main/deployment/ec2-setup.sh | bash
```

### **3. Environment Configuration**

#### **Express Server (.env)**
```env
# Database Configuration
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/orbitmail

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=3000
NODE_ENV=production

# Frontend URL for CORS
FRONTEND_URL=https://your-app.vercel.app

# SMTP Server URL
SMTP_URL=http://localhost:2525

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-api.com/api/v1/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY_PATH=path/to/your/apple/private/key.p8

# Razorpay Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

#### **SMTP Server (.env)**
```env
SMTP_PORT=2525
EXPRESS_URL=http://localhost:3000
```

#### **Email Service (.env)**
```env
EMAIL_SERVICE_PORT=3001
EXPRESS_URL=http://localhost:3000
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/orbitmail
```

#### **Frontend (.env)**
```env
VITE_EXPRESS_URL=https://your-api.com/api
```

## 🚀 **CI/CD Workflows**

### **1. Frontend Deployment (Vercel)**

**Trigger:** Push to `main` or `develop` branch with changes in `frontend/` folder

**Workflow:** `.github/workflows/frontend-deploy.yml`

**Process:**
1. Install dependencies
2. Run linting and tests
3. Build application
4. Deploy to Vercel

### **2. Express Server Deployment (EC2)**

**Trigger:** Push to `main` or `develop` branch with changes in `expresserver/` folder

**Workflow:** `.github/workflows/express-server-deploy.yml`

**Process:**
1. Install dependencies
2. Build application
3. Create deployment package
4. Copy to EC2
5. Stop current service
6. Deploy new version
7. Restart service
8. Health check

### **3. SMTP Server Deployment (EC2)**

**Trigger:** Push to `main` or `develop` branch with changes in `smtpserver/` folder

**Workflow:** `.github/workflows/smtp-server-deploy.yml`

**Process:**
1. Install dependencies
2. Build application
3. Create deployment package
4. Copy to EC2
5. Stop current service
6. Deploy new version
7. Restart service
8. Health check

### **4. Email Service Deployment (EC2)**

**Trigger:** Push to `main` or `develop` branch with changes in `emailservice/` folder

**Workflow:** `.github/workflows/email-service-deploy.yml`

**Process:**
1. Install dependencies
2. Build application
3. Create deployment package
4. Copy to EC2
5. Stop current service
6. Deploy new version
7. Restart service
8. Health check

## 📊 **Monitoring & Health Checks**

### **Health Check Endpoints**
```bash
# Express Server
curl https://your-api.com/health

# Email Service
curl https://your-api.com:3001/health

# SMTP Server
netstat -tlnp | grep :2525
```

### **Service Status**
```bash
# Check all services
sudo systemctl status orbitmail-*

# Check logs
sudo journalctl -u orbitmail-express -f
sudo journalctl -u orbitmail-smtp -f
sudo journalctl -u orbitmail-email -f
```

## 🔧 **Manual Deployment (if needed)**

### **Express Server**
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Navigate to directory
cd /opt/orbitmail/express-server

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --production

# Build application
npm run build

# Restart service
sudo systemctl restart orbitmail-express

# Check status
sudo systemctl status orbitmail-express
```

### **SMTP Server**
```bash
# Navigate to directory
cd /opt/orbitmail/smtp-server

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --production

# Restart service
sudo systemctl restart orbitmail-smtp

# Check status
sudo systemctl status orbitmail-smtp
```

### **Email Service**
```bash
# Navigate to directory
cd /opt/orbitmail/email-service

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --production

# Build application
npm run build

# Restart service
sudo systemctl restart orbitmail-email

# Check status
sudo systemctl status orbitmail-email
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Service Won't Start**
```bash
# Check logs
sudo journalctl -u orbitmail-express -n 50

# Check environment variables
sudo cat /opt/orbitmail/express-server/.env

# Check permissions
sudo chown -R orbitmail:orbitmail /opt/orbitmail/
```

#### **2. Port Already in Use**
```bash
# Check what's using the port
sudo netstat -tlnp | grep :3000

# Kill process if needed
sudo kill -9 <PID>
```

#### **3. Database Connection Issues**
```bash
# Test MongoDB connection
mongo "mongodb+srv://username:password@cluster.mongodb.net/orbitmail"

# Check network connectivity
ping cluster.mongodb.net
```

#### **4. SSL Certificate Issues**
```bash
# Check certificate validity
openssl s_client -connect your-domain.com:443

# Renew certificate if needed
sudo certbot renew
```

## 📈 **Performance Monitoring**

### **System Resources**
```bash
# Check CPU usage
htop

# Check memory usage
free -h

# Check disk usage
df -h

# Check network usage
iftop
```

### **Application Metrics**
```bash
# Check application logs
sudo tail -f /opt/orbitmail/express-server/logs/app.log

# Monitor email queue
curl https://your-api.com/api/v1/email/service/status
```

## 🔒 **Security Best Practices**

### **1. Firewall Configuration**
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Express Server
sudo ufw allow 2525/tcp  # SMTP Server
sudo ufw allow 3001/tcp  # Email Service
```

### **2. SSL/TLS Configuration**
```bash
# Install Certbot
sudo apt-get install certbot

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **3. Environment Security**
```bash
# Secure environment files
sudo chmod 600 /opt/orbitmail/*/.env

# Regular security updates
sudo apt-get update && sudo apt-get upgrade -y
```

## 🎉 **Deployment Checklist**

### **Pre-Deployment**
- [ ] GitHub secrets configured
- [ ] EC2 instance launched and configured
- [ ] MongoDB Atlas cluster created
- [ ] Domain name configured
- [ ] SSL certificate obtained

### **Deployment**
- [ ] Frontend deployed to Vercel
- [ ] Express server deployed to EC2
- [ ] SMTP server deployed to EC2
- [ ] Email service deployed to EC2
- [ ] All services running and healthy

### **Post-Deployment**
- [ ] Health checks passing
- [ ] SSL certificates working
- [ ] Email sending/receiving working
- [ ] OAuth authentication working
- [ ] Payment processing working
- [ ] Monitoring and logging configured

## 📞 **Support**

For deployment issues:
1. Check GitHub Actions logs
2. Check EC2 service logs
3. Verify environment variables
4. Test health check endpoints
5. Review security group settings

---

**🚀 Your OrbitMail platform is now ready for production deployment!** 