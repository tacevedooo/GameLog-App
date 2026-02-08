import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI, {
      autoIndex: true,
    });

    console.log("🟢 MongoDB connected successfully");
  } catch (error) {
    console.error("🔴 MongoDB connection failed");
    console.error(error.message);

    // stop the app if DB is down
    process.exit(1);
  }
};

export default dbConnection;
