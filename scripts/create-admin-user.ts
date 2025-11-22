import { dbConnect } from "../lib/db";
import { User } from "../models/user"; 
import { hashPassword } from "../lib/auth"; 

async function createAdminUser() {
  try {
    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      process.exit(0);
    }

    // Create default admin
    const hashedPassword = await hashPassword("admin@123");
    const admin = await User.create({
      email: "admin@academiccourse.com",
      password: hashedPassword,
      name: "Admin User",
      role: "admin",
    });

    console.log("Admin user created successfully:");
    console.log("Email: admin@academiccourse.com");
    console.log("Password: admin@123");
    console.log("Please change this password after first login!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();
