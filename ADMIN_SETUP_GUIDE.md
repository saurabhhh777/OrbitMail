# 🔐 Admin Account Setup Guide

## 📋 **Why No Admin Signup?**

You're absolutely right! We **should NOT** expose admin signup to regular users because:

1. **Security Risk**: Anyone could create admin accounts
2. **Data Exposure**: Regular users could access admin dashboard
3. **Platform Control**: Only authorized personnel should have admin access
4. **Audit Trail**: Need to track who has admin privileges

## 🚀 **Admin Account Creation Methods**

### **Method 1: Script-Based Setup (Recommended)**

#### **Step 1: Create Admin Script**
```bash
# Navigate to expresserver directory
cd expresserver

# Run the admin creation script
node scripts/create-admin.js
```

#### **Step 2: Default Admin Credentials**
```
📧 Email: admin@orbitmail.com
🔑 Password: admin123
```

#### **Step 3: Login as Admin**
1. Go to `/admin/login` in your frontend
2. Use the credentials above
3. Access admin dashboard at `/admin`

### **Method 2: Environment Variables**

#### **Step 1: Add to .env file**
```env
# Admin Setup
SETUP_ADMIN=true
ADMIN_EMAIL=admin@orbitmail.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=OrbitMail Admin
```

#### **Step 2: Restart Server**
```bash
# The admin account will be created automatically
npm run dev
```

### **Method 3: Direct MongoDB Insert**

#### **Step 1: Connect to MongoDB**
```bash
# Using MongoDB Compass or mongo shell
mongo "mongodb+srv://username:password@cluster.mongodb.net/orbitmail"
```

#### **Step 2: Insert Admin Document**
```javascript
// In MongoDB shell
use orbitmail_db

db.admins.insertOne({
  name: "OrbitMail Admin",
  email: "admin@orbitmail.com",
  password: "$2a$10$hashedPasswordHere", // Use bcrypt hash
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 🔧 **Production Deployment**

### **For EC2 Deployment:**

#### **Step 1: Add Admin Setup to Environment**
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Edit environment file
sudo nano /opt/orbitmail/express-server/.env

# Add these lines:
SETUP_ADMIN=true
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
ADMIN_NAME=Your Admin Name
```

#### **Step 2: Restart Services**
```bash
# Restart Express server
sudo systemctl restart orbitmail-express

# Check logs
sudo journalctl -u orbitmail-express -f
```

### **For Local Development:**

#### **Step 1: Run Admin Script**
```bash
cd expresserver
node scripts/create-admin.js
```

#### **Step 2: Test Admin Login**
```bash
# Start server
npm run dev

# Test admin login
curl -X POST http://localhost:7000/api/v1/admin/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@orbitmail.com","password":"admin123"}'
```

## 🔒 **Security Best Practices**

### **1. Change Default Password**
```bash
# After first login, change password immediately
# Use strong password with:
# - At least 8 characters
# - Mix of uppercase, lowercase, numbers, symbols
# - No common words or patterns
```

### **2. Use Environment Variables**
```env
# Never hardcode admin credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
```

### **3. Regular Password Rotation**
```bash
# Change admin password monthly
# Use password manager for secure storage
# Enable 2FA if possible
```

### **4. Monitor Admin Access**
```bash
# Check admin login logs
sudo journalctl -u orbitmail-express | grep "admin"

# Monitor failed login attempts
# Set up alerts for suspicious activity
```

## 📊 **Admin Dashboard Features**

### **Available Admin Functions:**
1. **User Management**
   - View all users
   - Search and filter users
   - User analytics

2. **Domain Management**
   - View all registered domains
   - Domain verification status
   - Email prefix management

3. **Email Analytics**
   - Platform-wide email statistics
   - Daily/weekly/monthly trends
   - Top domains by email volume

4. **Revenue Tracking**
   - Premium user count
   - Monthly revenue calculations
   - Subscription analytics

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. Admin Account Not Created**
```bash
# Check if script ran successfully
node scripts/create-admin.js

# Check MongoDB connection
# Verify environment variables
```

#### **2. Admin Login Fails**
```bash
# Check admin account exists
mongo "your-mongodb-url"
db.admins.findOne({email: "admin@orbitmail.com"})

# Verify password hash
# Check adminAuth middleware
```

#### **3. Admin Dashboard Not Accessible**
```bash
# Check admin token
# Verify adminAuth middleware
# Check frontend routing
```

## 🎯 **Recommended Setup**

### **For Development:**
```bash
# 1. Run admin script
node scripts/create-admin.js

# 2. Test admin login
# 3. Access admin dashboard
# 4. Change default password
```

### **For Production:**
```bash
# 1. Set environment variables
SETUP_ADMIN=true
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password-here

# 2. Deploy to EC2
# 3. Admin account created automatically
# 4. Login and change password
```

## 📋 **Admin Account Checklist**

### **Pre-Deployment:**
- [ ] Admin account creation method chosen
- [ ] Secure password generated
- [ ] Environment variables configured
- [ ] Admin script tested locally

### **Post-Deployment:**
- [ ] Admin account created successfully
- [ ] Admin login working
- [ ] Admin dashboard accessible
- [ ] Default password changed
- [ ] Admin functions tested

### **Security:**
- [ ] Strong password used
- [ ] Password changed from default
- [ ] Environment variables secure
- [ ] Admin access monitored

---

**🔐 Your admin authentication system is now secure and ready for production!** 