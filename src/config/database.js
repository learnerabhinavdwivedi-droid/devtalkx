import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Connecting to DB...");

    // Always keep your URI in .env file
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(uri);

    console.log("DB connection successful ✅");
  } catch (e) {
    console.error("❌ ERROR WHILE CONNECTING TO DB");
    console.error(e.message);
    process.exit(1); // Exit process if DB connection fails
  }
};
