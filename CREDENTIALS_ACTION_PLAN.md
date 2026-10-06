# 🔐 CREDENTIALS SECURITY ACTION PLAN

**Status**: ✅ GOOD NEWS - Credentials are NOT committed to git!

---

## 📋 CURRENT STATUS

### ✅ What's Safe
- ✅ `.env` file is **NOT tracked** in git
- ✅ `client_secret_*.json` file is **NOT tracked** in git  
- ✅ `.gitignore` already has proper entries to prevent future commits
- ✅ Git history does NOT contain any credentials
- ✅ Initial commit did NOT include secrets

### ⚠️ What Needs Action
- ⚠️ The exposed Google OAuth credentials (`GOCSPX-xxxxxxxxxxxxxxxxxxxx`) **must be rotated**
- ⚠️ These credentials are visible in the repo if anyone has access to your local machine or cloud storage
- ⚠️ If you ever pushed this repo to GitHub/GitLab with these files, assume credentials are compromised

---

## 🎯 IMMEDIATE ACTIONS (TODAY)

### Action 1: Verify Current State ✅
```bash
# Check git status
cd "c:\Users\rounak\OneDrive\Desktop\Distributors Ecommerce Site"
git status

# Verify secrets are NOT tracked
git ls-files | findstr client_secret
git ls-files | findstr .env

# Expected output: (nothing)
```

**Status**: ✅ Already verified - neither file is tracked

---

### Action 2: Rotate Google OAuth Credentials (URGENT) 🔄

**Current exposed credentials**:
```
Client ID: YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
Client Secret: GOCSPX-xxxxxxxxxxxxxxxxxxxx
```

**Steps**:

#### 2.1 Delete Current OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID (likely named "distributors webapp")
4. Click the delete icon (trash can)
5. Confirm deletion

#### 2.2 Create New OAuth 2.0 Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **+ Create Credentials** → **OAuth 2.0 Client ID**
3. Choose **Web application**
4. Set Authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
5. Set Authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)
6. Click **Create**
7. Copy the new **Client ID** and **Client Secret**

#### 2.3 Update .env with New Credentials
```bash
# Edit .env
GOOGLE_CLIENT_ID=<NEW-CLIENT-ID-HERE>
GOOGLE_CLIENT_SECRET=<NEW-CLIENT-SECRET-HERE>
SESSION_SECRET=<KEEP-EXISTING-OR-GENERATE-NEW>
MONGODB_URI=mongodb://127.0.0.1:27017/distributors_db
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your-16-char-app-password
```

**Time**: 5-10 minutes

---

### Action 3: Verify .gitignore Configuration ✅

Check that `.gitignore` has these entries:
```ignore
# Environment variables and secrets
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Google OAuth credentials
client_secret_*.json
credentials.json
```

**Current Status**: ✅ Already in place

**Verify**:
```bash
grep "client_secret_\*" .gitignore      # Should match
grep "^\.env$" .gitignore                # Should match
```

---

### Action 4: Test Application ✅

After updating credentials:

```bash
# 1. Verify dependencies
npm install

# 2. Start application
npm run dev

# 3. Check server starts without errors
# Expected: "Server is running on port 3000"
#           "MongoDB connected"

# 4. Test login/signup with OTP
# Visit: http://localhost:3000/signup

# 5. Test Google OAuth
# Click "Login with Google" button
# Should redirect to Google login, then back to your app
```

---

## 🔒 SECURITY HARDENING

### Additional Recommendations

#### 1. Add Environment Variable Validation
In `index.js`, add at startup:
```javascript
const requiredEnvVars = [
    'MONGODB_URI',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'SESSION_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS'
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`❌ ERROR: ${envVar} not set in .env`);
        process.exit(1);
    }
}
```

#### 2. Enable Git Hooks to Prevent Credential Commits
```bash
# Create file: .git/hooks/pre-commit
#!/bin/bash
if git diff --cached | grep -E "GOCSPX|client_secret|GOOGLE_CLIENT_SECRET"; then
    echo "❌ ERROR: Credentials detected in commit!"
    exit 1
fi
```

#### 3. Use Different Credentials Per Environment
**.env.development**:
```
NODE_ENV=development
GOOGLE_CLIENT_ID=dev-client-id
GOOGLE_CLIENT_SECRET=dev-client-secret
```

**.env.production**:
```
NODE_ENV=production
GOOGLE_CLIENT_ID=prod-client-id
GOOGLE_CLIENT_SECRET=prod-client-secret
```

Load with:
```javascript
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
```

---

## 📊 VERIFICATION CHECKLIST

- [ ] Old Google OAuth credentials deleted from Google Console
- [ ] New Google OAuth credentials created
- [ ] .env updated with new credentials
- [ ] `git status` shows `.env` and `client_secret_*.json` as untracked
- [ ] `git ls-files | grep -E "\.env|client_secret"` returns nothing
- [ ] `.gitignore` contains `.env` and `client_secret_*.json`
- [ ] Application starts: `npm run dev`
- [ ] Google OAuth login works
- [ ] OTP flow works
- [ ] No errors in server console

---

## 🆘 WHAT IF CREDENTIALS WERE ALREADY PUSHED TO GITHUB?

If you accidentally pushed this repo to GitHub/GitLab with the credentials visible:

### Emergency Steps:
1. **Delete the repo** from GitHub/GitLab
2. **Immediately revoke** the exposed credentials in Google Console
3. **Create new credentials** (as described above)
4. **Create new private repo**
5. Push the updated code with new credentials
6. Monitor Google Cloud console for suspicious activity

### Use BFG to Clean History (if already pushed):
```bash
# Install BFG (one-time)
# https://rtyley.github.io/bfg-repo-cleaner/

# Remove secrets from git history
bfg --delete-files client_secret_*.json
bfg --replace-text .env

# Force push
git push origin --force
```

---

## 📝 SUMMARY

| Task | Status | Time |
|------|--------|------|
| Credentials in git? | ✅ No | - |
| .gitignore configured? | ✅ Yes | - |
| **Rotate OAuth credentials** | ⏳ Pending | 5-10 min |
| **Update .env** | ⏳ Pending | 2 min |
| **Test application** | ⏳ Pending | 5 min |

**Total Time**: ~20 minutes

---

## 🎓 KEY LESSONS

1. **Never commit secrets** → Always use `.env` + `.gitignore`
2. **Rotate immediately** if credentials are exposed (even locally)
3. **Use different creds** for dev vs production
4. **Add env validation** at application startup
5. **Use git hooks** to prevent accidental commits
6. **Regularly audit** for exposed credentials

---

**Last Updated**: January 8, 2026  
**Responsible Action**: Rotate Google OAuth credentials today

