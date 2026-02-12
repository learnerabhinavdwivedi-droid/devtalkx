require("./env");
const mongoose = require("mongoose");

const resolveMongoUri = () => {
  const rawUri =
    process.env.DB_CONNECTION_SECRET ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URI;

  if (!rawUri) {
    throw new Error(
      "Missing MongoDB connection string. Set DB_CONNECTION_SECRET (or MONGO_URI / MONGODB_URI) in your .env file."
    );
  }

  const trimmedUri = rawUri.trim();

  // Fix common copy/paste mistakes in Atlas URIs (e.g. accidental space before @ host segment).
  const sanitizedUri = trimmedUri.replace(/\s+/g, "");

  // Avoid IPv6 localhost (::1) failures on systems where Mongo is bound only to IPv4.
  if (sanitizedUri.includes("mongodb://localhost")) {
    return sanitizedUri.replace("mongodb://localhost", "mongodb://127.0.0.1");
  }

  return sanitizedUri;
};

const connectDB = async () => {
 
  
  const mongoUri = resolveMongoUri();
  const isSrvUri = mongoUri.startsWith("mongodb+srv://");

  try {
    const connectionOptions = {
      serverSelectionTimeoutMS: 5000,
    };

    if (!isSrvUri) {
      connectionOptions.family = 4;
    }

    await mongoose.connect(mongoUri, connectionOptions);
  } catch (err) {
    if (err.message.includes("ECONNREFUSED")) {
      throw new Error(
        `MongoDB refused the connection for URI: ${mongoUri}. Ensure MongoDB is running and reachable on that host/port.`
      );
    }

    if (err.message.includes("bad auth") || err.message.includes("Authentication failed")) {
      throw new Error(
        "MongoDB authentication failed. Verify username/password in your MongoDB URI."
      );
    }

    if (err.message.includes("querySrv") || err.message.includes("ENOTFOUND")) {
      throw new Error(
        "Unable to resolve MongoDB Atlas host. Check your internet/DNS and Atlas cluster hostname in the URI."
      );
    }

    throw err;
  }
};

module.exports = connectDB;
module.exports.resolveMongoUri = resolveMongoUri;