## 🔍 COMPREHENSIVE SECURITY & CODE QUALITY AUDIT

### 1. ✅ FIXED ISSUES (Completed)
- ✅ Removed unused import `speakeasy` from otpService.js
- ✅ Fixed indentation inconsistencies in logger.js (2 spaces → 4 spaces)
- ✅ Added curly braces to if statements (single-line returns)
- ✅ Changed `let` to `const` where variables are not reassigned
- ✅ Renamed unused catch parameters to `_err` to suppress linting
- ✅ Masked OTP values in logs (logs only show `***masked***`)
- ✅ Limited client-side console.error to only print error message (no full objects)

---

### 2. ⚠️ CRITICAL SECURITY ISSUES

#### **A. Exposed Credentials in Repository** [HIGH]
**Location**: `.env` file & committed Google OAuth secrets
```
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxx
```
**Risk**: Credentials are exposed if repo is public.
**Action Required**:
```bash
# 1. Immediately revoke this credential at https://myaccount.google.com/security
# 2. Delete the committed file from git history:
git rm --cached "client_secret_YOUR_CLIENT_ID.apps.googleusercontent.com.json"
git commit -m "Remove exposed credentials"

# 3. Ensure .gitignore includes:
client_secret_*.json
.env
```

#### **B. Session Secret Hardcoded in Code** [HIGH]
**Location**: `index.js` line 27
```javascript
secret: process.env.SESSION_SECRET || 'YOUR_SESSION_SECRET_HERE',
```
**Risk**: Fallback uses the exposed Google secret!
**Fix**:
```javascript
// In .env:
SESSION_SECRET=<generate-strong-random-string>

// In code:
secret: process.env.SESSION_SECRET || require('crypto').randomBytes(32).toString('hex'),
```

#### **C. User Data Stored in Memory** [HIGH]
**Location**: `index.js` line 23
```javascript
const users = [];  // In-memory store - lost on restart!
```
**Risk**: Data loss, authentication bypass issues, not scalable.
**Status**: OTP flow uses MongoDB (User model) ✓, but passport serialization still uses in-memory.
**Fix**: Modify deserializeUser to query database:
```javascript
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
```

#### **D. Missing Input Validation** [MEDIUM-HIGH]
**Locations**: `/send-otp`, `/verify-otp`, signup/login routes
**Risk**: SQL injection, XSS, DoS via malicious input.
**Examples of missing validation**:
- Email format not validated (should use RFC5322 or email-validator package)
- OTP length not enforced (allows any string as OTP)
- Password constraints not checked (min length, complexity)
- No rate limiting on `/send-otp` → brute-force OTP generation

**Recommended Packages**:
```bash
npm install express-validator express-rate-limit
```

**Example Implementation**:
```javascript
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 OTP requests per IP per window
  message: 'Too many OTP requests, try again later'
});

app.post('/send-otp', otpLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('type').isIn(['login', 'signup'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  // ... rest of logic
});
```

---

### 3. ⚠️ npm VULNERABILITIES [MEDIUM]

**Found**: 3 vulnerabilities
```
- body-parser 2.2.0 (DoS via URL encoding)
- nodemailer <=7.0.10 (3 vulnerabilities: domain interpretation, recursion DoS)
- qs <6.14.1 (arrayLimit DoS via memory exhaustion)
```

**Fix All**:
```bash
npm audit fix
```

---

### 4. ⚠️ CODE QUALITY ISSUES

#### **A. Error Handling Missing Context** [MEDIUM]
**Issue**: Catch blocks don't log request context
```javascript
} catch (error) {
    logger.error('Send OTP error', error);  // ← No context about the email/type
    res.status(500).json({ success: false, message: 'Something went wrong' });
}
```
**Better**:
```javascript
} catch (error) {
    logger.error('Send OTP error', { 
        error: error.message, 
        email, 
        type,
        stack: error.stack 
    });
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
}
```

#### **B. Missing CSRF Protection** [MEDIUM]
**Risk**: Forms are vulnerable to Cross-Site Request Forgery.
**Fix**:
```bash
npm install csurf
```

#### **C. Missing HTTP Security Headers** [MEDIUM]
**Risk**: No protection against XSS, clickjacking, etc.
**Fix**:
```bash
npm install helmet
```
```javascript
const helmet = require('helmet');
app.use(helmet());
```

#### **D. Session Cookie Not Secure** [MEDIUM]
**Location**: `index.js` line 25
```javascript
cookie: { maxAge: 1000 * 60 * 60 },  // No secure/httpOnly flags!
```
**Fix**:
```javascript
cookie: { 
    maxAge: 1000 * 60 * 60,
    secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
    httpOnly: true,  // Prevent JS access
    sameSite: 'strict'  // CSRF protection
}
```

#### **E. Mongoose Injection Risk** [LOW-MEDIUM]
**Location**: `index.js` lines 232-237
```javascript
res.render(path.join(__dirname, 'views', 'zebronics', req.params.items));
```
**Risk**: Direct path traversal via params (e.g., `../../../etc/passwd`).
**Fix**:
```javascript
const validItems = ['tv', 'ac', 'fridge', 'wm'];
if (!validItems.includes(req.params.items)) {
    return res.status(404).send('Not found');
}
res.render(`zebronics/${req.params.items}`);
```

---

### 5. 🎯 DEPENDENCY IMPROVEMENTS

**Move to devDependencies**:
```json
"devDependencies": {
  "nodemon": "^3.1.10",
  "eslint": "^9.x.x"
}
```

**Add Recommended Packages**:
```bash
npm install express-validator express-rate-limit helmet csurf email-validator
npm install --save-dev jest supertest  # For testing
```

---

### 6. ✅ THINGS WORKING WELL

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ OTP stored in MongoDB with TTL (not in memory)
- ✅ Google OAuth 2.0 integrated properly
- ✅ Session storage in MongoDB (not memory)
- ✅ Structured logging added (not raw console.log)
- ✅ MongoDB indexed on email (fast lookups)

---

### 7. 📋 RECOMMENDED NEXT STEPS (Priority Order)

1. **URGENT**: Rotate exposed credentials & clean git history
2. **HIGH**: Add express-validator for input validation & express-rate-limit for OTP
3. **HIGH**: Fix session secret & cookie security flags
4. **HIGH**: Query User model in deserializeUser (not in-memory)
5. **MEDIUM**: Add helmet & csurf for security headers
6. **MEDIUM**: Add comprehensive error logging with context
7. **MEDIUM**: Add path traversal protection for dynamic routes
8. **LOW**: Add unit & integration tests
9. **LOW**: Consider OAuth2 providers (GitHub, Discord) for better UX

---

### 8. 📦 QUICK FIX CHECKLIST

```bash
# 1. Remove credentials from git
git rm --cached "client_secret_*.json" .env

# 2. Fix npm vulnerabilities
npm audit fix

# 3. Install security packages
npm install express-validator express-rate-limit helmet csurf email-validator
npm install --save-dev eslint @eslint/js

# 4. Run ESLint auto-fix
npx eslint --fix index.js services/*.js models/*.js

# 5. Update .env with new secrets
echo "SESSION_SECRET=$(node -e 'console.log(require(\"crypto\").randomBytes(32).toString(\"hex\"))')" >> .env
```

