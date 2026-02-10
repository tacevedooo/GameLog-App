import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/user.model.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminEmail = process.env.ADMIN_EMAIL;

    const existingAdmin = await User.findOne({
      email: adminEmail,
      role: "admin"
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    await User.create({
      username: "admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });

    console.log("🚀 Admin user created");
    process.exit(0);
  } catch (error) {
    console.error("❌ Admin seed error:", error);
    process.exit(1);
  }
};

seedAdmin();
