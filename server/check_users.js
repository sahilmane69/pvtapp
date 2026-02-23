const mongoose = require("mongoose");
require("dotenv").config();

async function checkUsers() {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/farmingo";
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log("--- Connected to MongoDB ---");

    const User = require("./models/User");
    const users = await User.find({}, { passwordHash: 0 }); // Exclude password hashes for security

    console.log(`Total Registrations: ${users.length}`);
    console.log("-----------------------------------------");
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}`);
      console.log(`   Role: ${user.role || "Not Set"}`);
      console.log(`   Phone: ${user.phone || "N/A"}`);
      console.log(`   Created At: ${user.createdAt}`);
      console.log("-----------------------------------------");
    });

  } catch (error) {
    console.error("Error connecting to database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("--- Disconnected ---");
  }
}

checkUsers();
