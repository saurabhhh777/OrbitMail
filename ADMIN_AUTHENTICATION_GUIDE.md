# 🔐 Admin Authentication & CI/CD Guide

## 📋 **Admin Authentication Flow**

### **1. How Admin Authentication Works**

#### **Frontend → Backend Flow:**
```
Admin Login Page (/admin/login)
    ↓
POST /api/v1/admin/signin
    ↓
Backend validates admin credentials
    ↓
JWT token with role: 'admin'
    ↓
Admin Dashboard (/admin)
```

#### **Backend Authentication Logic:**
```typescript
// 1. Admin signs in with email/password
export const adminSignin = async (req: Request, res: Response) => {
  // Validate admin credentials
  const adminUser = await admin.findOne({ email });
  
  // Create JWT with role: 'admin'
  const token = jwt.sign({
    id: adminUser._id,
    role: 'admin'  // ← This distinguishes admin from regular user
  }, process.env.JWT_SECRET);
  
  // Set adminToken cookie
  res.cookie("adminToken", token, { httpOnly: true });
};
```

#### **Middleware Protection:**
```typescript
// adminAuth middleware checks for admin role
export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  
  if (decoded.role !== 'admin') {  // ← Key check
    return res.status(401).json({ message: "Admin access required" });
  }
  
  req.adminId = decoded.id;
  next();
};
```

### **2. Admin vs User Authentication**

#### **User Authentication:**
- **Route:** `/api/v1/user/signin`
- **Cookie:** `token`
- **Role:** `user` (or no role specified)
- **Access:** User dashboard, email features

#### **Admin Authentication:**
- **Route:** `/api/v1/admin/signin`
- **Cookie:** `adminToken`
- **Role:** `admin`
- **Access:** Admin dashboard, user management, analytics

### **3. Frontend Admin Access**

#### **Admin Login Page:**
```typescript
// /admin/login
const AdminLogin = () => {
  const handleSubmit = async (e) => {
    const response = await fetch('/api/v1/admin/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.success) {
      navigate('/admin'); // Redirect to admin dashboard
    }
  };
};
```

#### **Admin Dashboard:**
```typescript
// /admin
const AdminDashboard = () => {
  // Admin-specific API calls
  const getUsers = async () => {
    const response = await fetch('/api/v1/admin/users', {
      credentials: 'include' // Sends adminToken cookie
    });
  };
};
```

## 🔧 **CI/CD Architecture Fix**

### **1. Original Issue (Incorrect)**
```yaml
# ❌ WRONG: Email service as separate deployment
on:
  paths:
    - 'emailservice/**'
jobs:
  deploy-email-service: # ← This was wrong
```

### **2. Corrected Architecture (Fixed)**
```yaml
# ✅ CORRECT: Email service triggers Express server deployment
on:
  paths:
    - 'emailservice/**'
jobs:
  deploy-express: # ← Now deploys Express server with updated email service
```

### **3. Why This Fix Makes Sense**

#### **Email Service Architecture:**
```
Express Server (expresserver/)
├── Controllers (email.controller.ts)
│   └── Uses Email Service Manager
├── Services (emailService.ts)
│   └── Imports email service as library
└── Email Service (emailservice/dist/)
    └── Custom SMTP, DNS, Queue logic
```

#### **Deployment Flow:**
```
1. Email service code changes
2. Build email service (npm run build)
3. Express server imports updated email service
4. Deploy Express server to EC2
5. Express server now uses updated email service
```

### **4. Updated CI/CD Workflows**

#### **Frontend Changes:**
```yaml
# .github/workflows/frontend-deploy.yml
on:
  paths:
    - 'frontend/**'
# Deploys to Vercel
```

#### **Express Server Changes:**
```yaml
# .github/workflows/express-server-deploy.yml
on:
  paths:
    - 'expresserver/**'
# Deploys Express server to EC2
```

#### **SMTP Server Changes:**
```yaml
# .github/workflows/smtp-server-deploy.yml
on:
  paths:
    - 'smtpserver/**'
# Deploys SMTP server to EC2
```

#### **Email Service Changes (FIXED):**
```yaml
# .github/workflows/email-service-deploy.yml
on:
  paths:
    - 'emailservice/**'
# Now deploys Express server (not separate email service)
```

## 🚀 **Deployment Architecture**

### **Production Setup:**
```
Frontend (Vercel)
    ↓
Express Server (EC2:3000)
    ↓
Email Service (Library within Express)
    ↓
SMTP Server (EC2:2525)
```

### **CI/CD Triggers:**
```
Frontend Changes → Deploy to Vercel
Express Changes → Deploy Express to EC2
SMTP Changes → Deploy SMTP to EC2
Email Service Changes → Deploy Express to EC2 (with updated email service)
```

## 📊 **Admin Dashboard Features**

### **1. User Management**
- View all users (free/premium)
- Search and filter users
- User analytics and statistics

### **2. Domain Management**
- View all registered domains
- Domain verification status
- Email prefix management

### **3. Email Analytics**
- Platform-wide email statistics
- Daily/weekly/monthly trends
- Top domains by email volume

### **4. Revenue Tracking**
- Premium user count
- Monthly revenue calculations
- Subscription analytics

## 🔒 **Security Considerations**

### **1. Admin Token Security**
```typescript
// Separate admin token with different cookie name
res.cookie("adminToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
});
```

### **2. Role-Based Access**
```typescript
// Middleware checks for admin role
if (decoded.role !== 'admin') {
  return res.status(401).json({ message: "Admin access required" });
}
```

### **3. Admin Routes Protection**
```typescript
// All admin routes protected
router.get("/dashboard", adminAuth, getAdminDashboard);
router.get("/users", adminAuth, getUsers);
router.get("/domains", adminAuth, getDomains);
```

## 🎯 **Summary of Fixes**

### **1. ✅ Admin Authentication Fixed**
- **Separate admin login page** (`/admin/login`)
- **Admin-specific JWT token** with `role: 'admin'`
- **Protected admin routes** with `adminAuth` middleware
- **Admin dashboard** with platform management features

### **2. ✅ CI/CD Architecture Fixed**
- **Email service changes** now trigger **Express server deployment**
- **No separate email service deployment** (it's a library)
- **Correct deployment flow** for all services

### **3. ✅ TypeScript Errors Fixed**
- **Admin controller functions** return `Promise<void>`
- **AdminAuth middleware** returns `void`
- **Proper type casting** in routes

## 🚀 **Next Steps**

### **1. Test Admin Authentication**
```bash
# 1. Create admin account
POST /api/v1/admin/signup
{
  "name": "Admin User",
  "email": "admin@orbitmail.com",
  "password": "admin123"
}

# 2. Login as admin
POST /api/v1/admin/signin
{
  "email": "admin@orbitmail.com",
  "password": "admin123"
}

# 3. Access admin dashboard
GET /api/v1/admin/dashboard
```

### **2. Test CI/CD Pipeline**
```bash
# Test email service changes
git add emailservice/src/
git commit -m "Update email service"
git push origin main
# Should trigger Express server deployment
```

### **3. Monitor Deployments**
- Check GitHub Actions logs
- Verify EC2 service status
- Test admin dashboard functionality

---

**🎉 Your admin authentication and CI/CD pipeline are now properly configured!** 