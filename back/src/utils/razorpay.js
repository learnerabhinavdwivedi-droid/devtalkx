const Razorpay = require("razorpay");

// Gracefully skip Razorpay initialization if keys are not configured
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    "⚠️  Razorpay keys not found. Payment routes will be disabled. " +
    "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file to enable payments."
  );
  module.exports = null;
} else {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  module.exports = instance;
}
