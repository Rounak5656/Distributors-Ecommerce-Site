const mongoose = require('mongoose');

const OtpTokenSchema = new mongoose.Schema({
    email: { type: String, required: true, index: true },
    code: { type: String, required: true },
    type: { type: String, enum: ['login', 'signup'], required: true },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

OtpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OtpToken', OtpTokenSchema);


