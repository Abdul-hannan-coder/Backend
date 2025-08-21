
import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      return new Date(Date.now() + 3 * 60 * 1000); // 3 minutes from now
    }
  }
}, {
  timestamps: true
});

// Index for automatic cleanup of expired OTPs
// TEMPORARILY DISABLED for debugging - was causing immediate deletion
// otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Manual cleanup method instead
otpSchema.statics.cleanupExpired = async function() {
  const now = new Date();
  return await this.deleteMany({ expiresAt: { $lt: now } });
};

// Add a method to check if OTP is expired
otpSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Add a method to get time until expiration
otpSchema.methods.timeUntilExpiration = function() {
  const now = new Date();
  const timeLeft = this.expiresAt - now;
  return Math.max(0, timeLeft);
};


export default mongoose.model('Otp', otpSchema);
