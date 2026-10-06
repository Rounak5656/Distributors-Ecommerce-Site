/**
 * SECURITY IMPROVEMENTS - Sample Implementation
 * 
 * This file shows recommended fixes for the security issues found in the audit.
 * Apply these changes incrementally to your codebase.
 */

// ============================================
// 1. UPDATED index.js with Security Fixes
// ============================================

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const validator = require('email-validator');

const app = express();

// Apply security middleware FIRST
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration with secure flags
const sessionConfig = {
    secret: process.env.SESSION_SECRET,  // MUST be set in .env
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,  // 1 hour
        secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
        httpOnly: true,  // Prevent JavaScript access
        sameSite: 'strict'  // CSRF protection
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
    })
};

// Rate limiters
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 5,  // Max 5 OTP requests per IP
    message: 'Too many OTP requests. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,  // 1 hour
    max: 10,  // Max 10 login attempts per IP
    skipSuccessfulRequests: true
});

// ============================================
// 2. INPUT VALIDATION EXAMPLES
// ============================================

// Validation middleware for OTP routes
const validateOTPRequest = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address'),
    body('type')
        .isIn(['login', 'signup'])
        .withMessage('Invalid OTP type')
];

const validateOTPVerify = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address'),
    body('otp')
        .trim()
        .isLength({ min: 6, max: 6 })
        .isNumeric()
        .withMessage('OTP must be 6 digits'),
    body('type')
        .isIn(['login', 'signup'])
        .withMessage('Invalid OTP type'),
    body('name')
        .if(() => body('type').equals('signup'))
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('password')
        .if(() => body('type').equals('signup'))
        .trim()
        .isLength({ min: 8 })
        .matches(/[A-Z]/).withMessage('Password must contain uppercase')
        .matches(/[a-z]/).withMessage('Password must contain lowercase')
        .matches(/[0-9]/).withMessage('Password must contain number')
        .withMessage('Password must be at least 8 characters with mixed case and numbers')
];

// Validation middleware helper
function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
}

// ============================================
// 3. SECURE ROUTES EXAMPLE
// ============================================

// Send OTP with validation and rate limiting
app.post('/send-otp',
    otpLimiter,
    validateOTPRequest,
    handleValidationErrors,
    async (req, res) => {
        try {
            const { email, type } = req.body;
            const User = require('./models/User');

            // Database validations
            if (type === 'login') {
                const user = await User.findOne({ email }).lean();
                if (!user) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email not registered'
                    });
                }
            } else if (type === 'signup') {
                const existingUser = await User.findOne({ email }).lean();
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email already registered'
                    });
                }
            }

            // Generate and send OTP
            const otpService = require('./services/otpService');
            const otp = otpService.generateOTP();
            await otpService.storeOTP(email, otp, type);

            // Log with context (OTP masked)
            const logger = require('./services/logger');
            logger.info('OTP requested', { email, type });

            const emailSent = await otpService.sendOTPEmail(email, otp);
            if (emailSent) {
                res.json({
                    success: true,
                    message: 'OTP sent to your email'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to send OTP. Please try again.'
                });
            }
        } catch (error) {
            const logger = require('./services/logger');
            logger.error('Send OTP error', {
                error: error.message,
                stack: error.stack
            });
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
);

// ============================================
// 4. FIX DESERIALIZE USER (Database Query)
// ============================================

const passport = require('passport');

// This replaces the in-memory deserializeUser
passport.deserializeUser(async (id, done) => {
    try {
        const User = require('./models/User');
        const user = await User.findById(id).lean();
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// ============================================
// 5. FIX DYNAMIC ROUTE TRAVERSAL
// ============================================

const path = require('path');

// Whitelist allowed products
const ALLOWED_BRANDS = {
    zebronics: ['tv', 'ac', 'fridge', 'wm', 'it', 'speakers'],
    TAKARA: ['tv', 'ac', 'fridge', 'wm'],
    GEM: ['tv', 'ac', 'fridge', 'wm']
};

app.get('/zebronics/:item', (req, res, next) => {
    const { item } = req.params;
    if (!ALLOWED_BRANDS.zebronics.includes(item)) {
        return res.status(404).render('404');
    }
    res.render(path.join('zebronics', item));
});

app.get('/TAKARA/:item', (req, res, next) => {
    const { item } = req.params;
    if (!ALLOWED_BRANDS.TAKARA.includes(item)) {
        return res.status(404).render('404');
    }
    res.render(path.join('TAKARA', item));
});

app.get('/GEM/:item', (req, res, next) => {
    const { item } = req.params;
    if (!ALLOWED_BRANDS.GEM.includes(item)) {
        return res.status(404).render('404');
    }
    res.render(path.join('GEM', item));
});

// ============================================
// 6. UPDATE .env FILE
// ============================================

/*
Required .env variables:
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/distributors_db
MONGODB_DB=distributors_db

# Security - Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=<generate-strong-random-value>

# Google OAuth - Rotate the exposed credentials!
GOOGLE_CLIENT_ID=<your-new-client-id>
GOOGLE_CLIENT_SECRET=<your-new-client-secret>

# Email Service
EMAIL_USER=<your-email@gmail.com>
EMAIL_PASS=<your-app-password>
*/

// ============================================
// 7. NOTES
// ============================================

/*
IMMEDIATE ACTIONS:
1. Rotate Google OAuth credentials at https://console.cloud.google.com/
2. Delete committed credentials from git history:
   git rm --cached "client_secret_*.json" .env
   git commit -m "Remove exposed credentials"
3. Generate new SESSION_SECRET and update .env
4. Test thoroughly before deploying to production

OPTIONAL: Consider using express-csrf instead of csurf (unmaintained)
or rely on SameSite cookie attribute for basic CSRF protection.
*/

module.exports = app;
