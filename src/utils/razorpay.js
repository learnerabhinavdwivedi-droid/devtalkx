const Razorpay = require("razorpay");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error(
    "Missing Razorpay env vars. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in back/.env"
  );
}

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = instance;
