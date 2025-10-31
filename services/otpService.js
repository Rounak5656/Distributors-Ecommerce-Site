const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');

class OTPService {
    constructor() {
        // In-memory storage हटाएँ; MongoDB use करेंगे
        this.otpStore = new Map();
        
        // Email transporter setup
        this.transporter = nodemailer.createTransport({
            service: 'gmail', // या कोई भी email service
            auth: {
                user: process.env.EMAIL_USER || 'your-email@gmail.com',
                pass: process.env.EMAIL_PASS || 'your-app-password'
            }
        });
    }

    // 6-digit OTP generate करें
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // OTP store करें (MongoDB) - 5 minutes expiry
    async storeOTP(email, otp, type = 'signup') {
        try {
            const OtpToken = require('../models/OtpToken');
            const expiresAt = new Date(Date.now() + (5 * 60 * 1000));
            await OtpToken.deleteMany({ email, type });
            await OtpToken.create({ email, code: otp, type, expiresAt });
        } catch (err) {
            console.error('Store OTP failed:', err);
        }
    }

    // OTP verify करें
    async verifyOTP(email, inputOTP, type = 'signup') {
        try {
            const OtpToken = require('../models/OtpToken');
            const doc = await OtpToken.findOne({ email, type }).sort({ createdAt: -1 });
            if (!doc) return false;
            if (new Date() > doc.expiresAt) {
                await OtpToken.deleteMany({ email, type });
                return false;
            }
            const ok = doc.code === inputOTP;
            if (ok) {
                await OtpToken.deleteMany({ email, type });
            }
            return ok;
        } catch (err) {
            console.error('Verify OTP failed:', err);
            return false;
        }
    }

    // Email में OTP भेजें
    async sendOTPEmail(email, otp) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'your-email@gmail.com',
                to: email,
                subject: 'KAMLAS - OTP Verification',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2b6cb0;">KAMLAS Distributors</h2>
                        <h3>OTP Verification</h3>
                        <p>Your OTP for account verification is:</p>
                        <div style="background: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
                            <h1 style="color: #2b6cb0; font-size: 32px; margin: 0;">${otp}</h1>
                        </div>
                        <p>This OTP will expire in 5 minutes.</p>
                        <p>If you didn't request this OTP, please ignore this email.</p>
                        <hr>
                        <p style="color: #666; font-size: 12px;">© 2024 KAMLAS Distributors</p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }

    // SMS OTP भेजें (Twilio के साथ)
    async sendOTPSMS(phoneNumber, otp) {
        // Twilio setup (optional)
        // const client = require('twilio')(accountSid, authToken);
        // await client.messages.create({
        //     body: `Your KAMLAS OTP is: ${otp}. Valid for 5 minutes.`,
        //     from: '+1234567890',
        //     to: phoneNumber
        // });
        
        console.log(`SMS OTP for ${phoneNumber}: ${otp}`);
        return true;
    }

    // MongoDB TTL index handle करेगा; manual cleanup की ज़रूरत नहीं
    cleanupExpiredOTPs() {}
}

module.exports = new OTPService();

