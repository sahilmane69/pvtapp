const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

const uri = "mongodb://localhost:27017/farmingo";

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for full seeding...");

    // 1. Clear All
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("Cleared all existing collection data.");

    // 2. Create Users
    const users = [
      { username: "ramesh", passwordHash: "password123", role: "farmer" },
      { username: "suresh", passwordHash: "password123", role: "delivery" },
      { username: "anil", passwordHash: "password123", role: "customer" },
      { username: "admin", passwordHash: "password123", role: "admin" },
    ];
    const createdUsers = await User.insertMany(users);
    const farmer = createdUsers.find(u => u.username === "ramesh");
    const customer = createdUsers.find(u => u.username === "anil");
    const delivery = createdUsers.find(u => u.username === "suresh");
    console.log("Created dummy users.");

    // 3. Create Products (linked to farmer)
    const products = [
      {
        name: "Hybrid Tomato Seeds",
        category: "Seeds",
        price: 450,
        quantityAvailable: 100,
        image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&q=80",
        description: "High-yield hybrid seeds.",
        farmerId: farmer._id
      },
      {
        name: "Organic Nitrogen",
        category: "Fertilizers",
        price: 1200,
        quantityAvailable: 50,
        image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=400&q=80",
        description: "Balanced fertilizer.",
        farmerId: farmer._id
      }
    ];
    const createdProducts = await Product.insertMany(products);
    console.log("Created products linked to farmer ramesh.");

    // 4. Create dummy orders
    const orders = [
      {
        farmerId: farmer._id,
        customerId: customer._id,
        items: [
          { productId: createdProducts[0]._id, name: createdProducts[0].name, price: 450, quantity: 2 }
        ],
        status: "delivered",
        totalAmount: 900,
        deliveryPartnerId: delivery._id,
        deliveryAddress: "123 Green Valley, Pune",
        createdAt: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        farmerId: farmer._id,
        customerId: customer._id,
        items: [
          { productId: createdProducts[1]._id, name: createdProducts[1].name, price: 1200, quantity: 1 }
        ],
        status: "pending",
        totalAmount: 1200,
        deliveryAddress: "456 Lake View, Mumbai"
      }
    ];
    await Order.insertMany(orders);
    console.log("Created sample orders for full flow simulation.");

    await mongoose.disconnect();
    console.log("Seeding complete. Disconnected.");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
