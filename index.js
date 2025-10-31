const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const otpService = require('./services/otpService');
const MongoStore = require('connect-mongo');
const { mongoConnect } = require('./services/mongo');
require('dotenv').config();

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

// simple in-memory user store (for demo)
const users = [];
const User = require('./models/User');

// session setup
app.use(session({
    secret: process.env.SESSION_SECRET || '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',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/distributors_db',
        collectionName: 'sessions'
    })
}));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    // Check if user exists in our database
    let user = users.find(u => u.googleId === profile.id);
    if (user) {
        return done(null, user);
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        provider: 'google'
    };
    users.push(newUser);
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

// expose user to views
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

//main page
app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/main page.html');
    res.render("index");
});

// auth routes
app.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/login', { error: null, values: {} });
});

app.get('/signup', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/signup', { error: null, values: {} });
});

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).render('auth/signup', { error: 'Please fill all fields', values: { name, email } });
        const existing = users.find(u => u.email === email);
        if (existing) return res.status(400).render('auth/signup', { error: 'Email already exists', values: { name, email } });
        const hash = await bcrypt.hash(password, 10);
        const user = { id: Date.now().toString(), name, email, passwordHash: hash };
        users.push(user);
        req.session.user = { id: user.id, name: user.name, email: user.email };
        res.redirect('/');
    } catch (err) {
        res.status(500).render('auth/signup', { error: 'Something went wrong', values: {} });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);
        if (!user) return res.status(400).render('auth/login', { error: 'Invalid email or password', values: { email } });
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(400).render('auth/login', { error: 'Invalid email or password', values: { email } });
        req.session.user = { id: user.id, name: user.name, email: user.email };
        res.redirect('/');
    } catch (err) {
        res.status(500).render('auth/login', { error: 'Something went wrong', values: {} });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        req.session.user = { id: req.user.id, name: req.user.name, email: req.user.email };
        res.redirect('/');
    }
);

// OTP Routes
app.post('/send-otp', async (req, res) => {
    try {
        const { email, type } = req.body; // type: 'login' or 'signup'
        
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Check if email exists for login
        if (type === 'login') {
            const user = await User.findOne({ email }).lean();
            if (!user) {
                return res.status(400).json({ success: false, message: 'Email not found' });
            }
        }

        // Check if email exists for signup
        if (type === 'signup') {
            const existingUser = await User.findOne({ email }).lean();
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }
        }

        const otp = otpService.generateOTP();
        await otpService.storeOTP(email, otp, type || 'signup');
        console.log(`[OTP][${type}] ${email}: ${otp}`);
        
        // Send OTP via email
        const emailSent = await otpService.sendOTPEmail(email, otp);
        
        if (emailSent) {
            res.json({ success: true, message: 'OTP sent to your email' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to send OTP' });
        }
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
});

app.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp, type, name, password } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        const isValid = await otpService.verifyOTP(email, otp, type || 'signup');
        
        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        if (type === 'login') {
            const user = await User.findOne({ email });
            req.session.user = { id: user._id.toString(), name: user.name, email: user.email };
            res.json({ success: true, message: 'Login successful', redirect: '/' });
        } else if (type === 'signup') {
            if (!name || !password) {
                return res.status(400).json({ success: false, message: 'Name and password are required' });
            }
            const hash = await bcrypt.hash(password, 10);
            const user = await User.create({ name, email, passwordHash: hash, verified: true, provider: 'local' });
            req.session.user = { id: user._id.toString(), name: user.name, email: user.email };
            res.json({ success: true, message: 'Account created successfully', redirect: '/' });
        }
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
});

app.get('/crockery.ejs', (req, res) => {
    res.render("crockery");
});
app.get('/zebronics/:items', (req, res) => {
    res.render(path.join(__dirname, 'views', 'zebronics', req.params.items));
});

app.get('/TAKARA/:item', (req, res) => {
    res.render(path.join(__dirname, 'views', 'TAKARA', req.params.item));
});

app.get('/GEM/:item', (req, res) => {
    res.render(path.join(__dirname, 'views', 'GEM', req.params.item));
});

mongoConnect().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.error('Failed to start server due to Mongo error:', err);
});