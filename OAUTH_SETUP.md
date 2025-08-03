# OAuth Setup Guide for Development

## 🚀 **Quick Fix for Development**

Since you're running on localhost, you have a few options:

### **Option 1: Disable OAuth for Development (Easiest)**

Modify the OAuth buttons to show a development message instead of redirecting:

```typescript
const handleGoogleAuth = async () => {
  toast.info('OAuth not configured for development. Please use email/password signup.');
};
```

### **Option 2: Set Up OAuth for Development**

#### **Google OAuth Setup:**

1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project: "OrbitMail-Dev"
   - Enable Google+ API

2. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "OrbitMail Development"
   - Authorized redirect URIs:
     ```
     http://localhost:5173/auth/callback
     http://localhost:3000/auth/callback
     http://localhost:4173/auth/callback
     ```

3. **Copy Client ID and Secret:**
   - Copy the Client ID and Client Secret
   - Add to your `.env` file:

```env
# Frontend (.env)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Backend (.env)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
```

#### **GitHub OAuth Setup:**

1. **Create GitHub OAuth App:**
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"
   - Application name: "OrbitMail Development"
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:5173/auth/callback`

2. **Add to Environment:**
```env
# Frontend (.env)
VITE_GITHUB_CLIENT_ID=your_github_client_id_here

# Backend (.env)
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_REDIRECT_URI=http://localhost:5173/auth/callback
```

### **Option 3: Use ngrok for Development**

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Start your app and expose it:**
   ```bash
   # Start your frontend
   npm run dev
   
   # In another terminal, expose localhost
   ngrok http 5173
   ```

3. **Use the ngrok URL in OAuth setup:**
   - Use the ngrok URL (e.g., `https://abc123.ngrok.io`) in your OAuth redirect URIs
   - This allows you to test OAuth locally

## 🔧 **Immediate Fix for Testing**

For now, you can modify the OAuth handlers to show a development message:

```typescript
const handleGoogleAuth = async () => {
  toast.info('Google OAuth not configured for development. Please use email/password signup.');
};

const handleGithubAuth = async () => {
  toast.info('GitHub OAuth not configured for development. Please use email/password signup.');
};

const handleAppleAuth = async () => {
  toast.info('Apple OAuth not configured for development. Please use email/password signup.');
};
```

## 📝 **Environment Variables Needed**

### **Frontend (.env):**
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### **Backend (.env):**
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:5173/auth/callback

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 🎯 **Recommended Approach for Development**

1. **Start with Option 1** (disable OAuth) for quick development
2. **Set up OAuth later** when you're ready to test the full flow
3. **Use ngrok** if you need to test OAuth during development

This way you can continue developing without OAuth errors! 