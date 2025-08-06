# Domain Setup Guide for OrbitMail

## Adding Your Domain

When you add a domain like `voidmail.fun` to OrbitMail, the system will provide you with the MX records that need to be configured in your DNS settings.

## Required MX Records

For your domain to work with OrbitMail, you need to add these MX records to your DNS configuration:

### MX Records to Add:

1. **Priority 10**: `mx1.orbitmail.fun`
2. **Priority 20**: `mx2.orbitmail.fun`  
3. **Priority 30**: `mx3.orbitmail.fun`

## DNS Configuration Instructions

### Step 1: Access Your DNS Provider
- Log into your domain registrar or DNS provider (e.g., Cloudflare, GoDaddy, Namecheap)
- Navigate to the DNS management section for `voidmail.fun`

### Step 2: Add MX Records
Add these three MX records:

| Type | Name | Value | Priority | TTL |
|------|------|-------|----------|-----|
| MX | @ | mx1.orbitmail.fun | 10 | 3600 |
| MX | @ | mx2.orbitmail.fun | 20 | 3600 |
| MX | @ | mx3.orbitmail.fun | 30 | 3600 |

### Step 3: Remove Existing MX Records
Before adding the OrbitMail MX records, you should remove any existing MX records that point to other email providers (like the current Zoho records).

### Step 4: Verify Configuration
After adding the MX records:
1. Wait 5-10 minutes for DNS propagation
2. Click the "Verify DNS" button in your OrbitMail dashboard
3. The system will check if all three MX records are properly configured

## Current Status for voidmail.fun

Based on the DNS test, `voidmail.fun` currently has these MX records:
- mail.voidmail.fun (priority: 10)
- mx2.zoho.in (priority: 20)
- mx.zoho.in (priority: 10)
- mx3.zoho.in (priority: 50)

**Action Required**: Replace these with the OrbitMail MX records listed above.

## Troubleshooting

### If Verification Fails:
1. **Check DNS Propagation**: DNS changes can take up to 48 hours to propagate globally
2. **Verify MX Records**: Use online tools like `dig` or `nslookup` to check your MX records
3. **Check TTL**: Ensure TTL is set to 3600 seconds or lower for faster propagation
4. **Remove Old Records**: Make sure old MX records are completely removed

### Testing Your DNS Configuration:
```bash
# Test MX records from command line
dig MX voidmail.fun
# or
nslookup -type=mx voidmail.fun
```

## Support

If you encounter issues with domain verification:
1. Check that all three MX records are properly configured
2. Wait for DNS propagation (5-10 minutes minimum)
3. Contact support if verification still fails after 24 hours 