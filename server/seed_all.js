/**
 * FarminGo - Comprehensive Seed Script
 * Populates the DB with production-quality dummy data:
 *  - 5 Users (1 admin, 2 farmers, 1 delivery, 1 customer)
 *  - 30 Products (Seeds, Fertilizers, Tools) with real Unsplash images
 *  - 12 Orders (various statuses) with realistic data
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/farmingo";

// ─────────────────────────────────────────────
// 1. PRODUCTS DATA
// ─────────────────────────────────────────────
function buildProducts(farmerId1, farmerId2) {
  return [
    // ── SEEDS (10 products) ───────────────────────────────────────────
    {
      name: "Premium Tomato Seeds",
      category: "Seeds",
      price: 349,
      mrp: 499,
      discount: 30,
      quantityAvailable: 120,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
      description: "High-yield hybrid tomato seeds. Disease resistant, all-season variety. Germination rate 95%.",
      farmerId: farmerId1,
    },
    {
      name: "Organic Spinach Seeds",
      category: "Seeds",
      price: 99,
      mrp: 149,
      discount: 34,
      quantityAvailable: 250,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
      description: "Fast-growing spinach rich in iron & nutrients. Harvest in just 45 days.",
      farmerId: farmerId1,
    },
    {
      name: "Golden Sweet Corn Seeds",
      category: "Seeds",
      price: 279,
      mrp: 399,
      discount: 30,
      quantityAvailable: 180,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
      description: "Sweet corn variety with large, plump kernels. Excellent for boiling and roasting.",
      farmerId: farmerId2,
    },
    {
      name: "Crispy Cucumber Seeds",
      category: "Seeds",
      price: 149,
      mrp: 199,
      discount: 25,
      quantityAvailable: 140,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=80",
      description: "Crisp and juicy cucumbers, perfect for salads. High germination rate of 92%.",
      farmerId: farmerId1,
    },
    {
      name: "Hot Chili Pepper Seeds",
      category: "Seeds",
      price: 169,
      mrp: 249,
      discount: 32,
      quantityAvailable: 95,
      stockStatus: "Low Stock",
      image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80",
      description: "Spicy chili variety ideal for hot climates. Produces vibrant red chilies.",
      farmerId: farmerId2,
    },
    {
      name: "Hybrid Brinjal Seeds",
      category: "Seeds",
      price: 199,
      mrp: 299,
      discount: 33,
      quantityAvailable: 110,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=800&q=80",
      description: "Large, glossy purple brinjal hybrid. High yield per plant.",
      farmerId: farmerId1,
    },
    {
      name: "Baby Carrot Seeds",
      category: "Seeds",
      price: 129,
      mrp: 179,
      discount: 28,
      quantityAvailable: 200,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=800&q=80",
      description: "Sweet, tender baby carrots. Ideal for containers and garden beds. Ready in 70 days.",
      farmerId: farmerId2,
    },
    {
      name: "Watermelon Seeds (Seedless)",
      category: "Seeds",
      price: 449,
      mrp: 599,
      discount: 25,
      quantityAvailable: 75,
      stockStatus: "Low Stock",
      image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=800&q=80",
      description: "Premium seedless watermelon variety. Large fruits, sweet flesh.",
      farmerId: farmerId1,
    },
    {
      name: "Capsicum Mixed Seeds",
      category: "Seeds",
      price: 219,
      mrp: 299,
      discount: 27,
      quantityAvailable: 130,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
      description: "Mixed red, yellow & green capsicum seeds. Beautiful color variety for any kitchen garden.",
      farmerId: farmerId2,
    },
    {
      name: "Radish Seeds (Cherry Belle)",
      category: "Seeds",
      price: 89,
      mrp: 129,
      discount: 31,
      quantityAvailable: 300,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1570493516895-2f0c800a51dc?auto=format&fit=crop&w=800&q=80",
      description: "Quick-growing cherry belle radish. Harvest in just 25 days.",
      farmerId: farmerId1,
    },

    // ── FERTILIZERS (10 products) ─────────────────────────────────────
    {
      name: "NPK 19-19-19 Fertilizer (1kg)",
      category: "Fertilizers",
      price: 899,
      mrp: 1199,
      discount: 25,
      quantityAvailable: 60,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80",
      description: "Balanced water-soluble fertilizer for overall plant growth. Ideal for all crops.",
      farmerId: farmerId2,
    },
    {
      name: "Urea 46% (2kg Bag)",
      category: "Fertilizers",
      price: 649,
      mrp: 849,
      discount: 24,
      quantityAvailable: 110,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80",
      description: "High nitrogen urea for lush, green foliage. Fast-acting and effective.",
      farmerId: farmerId1,
    },
    {
      name: "Organic Vermicompost (5kg)",
      category: "Fertilizers",
      price: 349,
      mrp: 499,
      discount: 30,
      quantityAvailable: 350,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1416879115507-1961852e6157?auto=format&fit=crop&w=800&q=80",
      description: "100% organic vermicompost. Improves soil texture, water retention and microbial activity.",
      farmerId: farmerId2,
    },
    {
      name: "Neem Cake Fertilizer (2kg)",
      category: "Fertilizers",
      price: 499,
      mrp: 699,
      discount: 29,
      quantityAvailable: 85,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1599307734107-160243058f40?auto=format&fit=crop&w=800&q=80",
      description: "Natural fertilizer and organic pest repellent. Dual action, eco-friendly.",
      farmerId: farmerId1,
    },
    {
      name: "Potassium Humate Granules (1kg)",
      category: "Fertilizers",
      price: 749,
      mrp: 999,
      discount: 25,
      quantityAvailable: 40,
      stockStatus: "Low Stock",
      image: "https://images.unsplash.com/photo-1530267981375-f0de93cdf5b8?auto=format&fit=crop&w=800&q=80",
      description: "Enhances nutrient uptake and root growth. Organic carbon source for all crops.",
      farmerId: farmerId2,
    },
    {
      name: "Seaweed Extract (500ml)",
      category: "Fertilizers",
      price: 599,
      mrp: 799,
      discount: 25,
      quantityAvailable: 70,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1589923188900-85da00a7398b?auto=format&fit=crop&w=800&q=80",
      description: "Liquid seaweed concentrate. Promotes stronger roots and improves crop yield.",
      farmerId: farmerId1,
    },
    {
      name: "DAP Fertilizer (1kg)",
      category: "Fertilizers",
      price: 779,
      mrp: 999,
      discount: 22,
      quantityAvailable: 90,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1618374789461-6a51c9a73543?auto=format&fit=crop&w=800&q=80",
      description: "Di-Ammonium Phosphate for root development and early plant establishment.",
      farmerId: farmerId2,
    },
    {
      name: "Organic Panchagavya (1L)",
      category: "Fertilizers",
      price: 449,
      mrp: 599,
      discount: 25,
      quantityAvailable: 55,
      stockStatus: "Low Stock",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80",
      description: "Traditional organic liquid fertilizer. Boosts immunity and overall plant health.",
      farmerId: farmerId1,
    },
    {
      name: "Bone Meal Powder (1kg)",
      category: "Fertilizers",
      price: 399,
      mrp: 549,
      discount: 27,
      quantityAvailable: 120,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80",
      description: "Natural phosphorus and calcium supplement. Strengthens plant structure.",
      farmerId: farmerId2,
    },
    {
      name: "Potash (MOP) 1kg",
      category: "Fertilizers",
      price: 549,
      mrp: 749,
      discount: 27,
      quantityAvailable: 100,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1599307734107-160243058f40?auto=format&fit=crop&w=800&q=80",
      description: "Muriate of potash for fruit quality, disease resistance and drought tolerance.",
      farmerId: farmerId1,
    },

    // ── TOOLS (10 products) ───────────────────────────────────────────
    {
      name: "Heavy Duty Garden Shovel",
      category: "Tools",
      price: 849,
      mrp: 1199,
      discount: 29,
      quantityAvailable: 35,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1416879115507-1961852e6157?auto=format&fit=crop&w=800&q=80",
      description: "Forged steel shovel with ergonomic wooden handle. Essential for digging and planting.",
      farmerId: farmerId2,
    },
    {
      name: "Professional Pruning Shears",
      category: "Tools",
      price: 499,
      mrp: 699,
      discount: 29,
      quantityAvailable: 50,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1598512114175-5873a4365611?auto=format&fit=crop&w=800&q=80",
      description: "Sharp bypass pruners for trimming plants and bushes. Titanium-coated blades.",
      farmerId: farmerId1,
    },
    {
      name: "Watering Can 8L (Metal)",
      category: "Tools",
      price: 649,
      mrp: 899,
      discount: 28,
      quantityAvailable: 65,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1586694048139-9f5e6f61c98c?auto=format&fit=crop&w=800&q=80",
      description: "Durable galvanized metal watering can with removable rose head. Long spout for reach.",
      farmerId: farmerId2,
    },
    {
      name: "Garden Trowel Set (3pcs)",
      category: "Tools",
      price: 399,
      mrp: 549,
      discount: 27,
      quantityAvailable: 80,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=800&q=80",
      description: "Set of 3 stainless steel trowels. Perfect for planting, digging and transplanting.",
      farmerId: farmerId1,
    },
    {
      name: "Knapsack Sprayer 16L",
      category: "Tools",
      price: 1999,
      mrp: 2799,
      discount: 29,
      quantityAvailable: 18,
      stockStatus: "Low Stock",
      image: "https://images.unsplash.com/photo-1530519729491-acf5830006f0?auto=format&fit=crop&w=800&q=80",
      description: "Manual backpack sprayer for pesticides and fertilizers. Adjustable nozzle.",
      farmerId: farmerId2,
    },
    {
      name: "Telescopic Garden Rake",
      category: "Tools",
      price: 599,
      mrp: 849,
      discount: 29,
      quantityAvailable: 28,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1589051039495-2c930500d43a?auto=format&fit=crop&w=800&q=80",
      description: "Extendable handle garden rake. Adjusts from 90cm to 150cm. Lightweight aluminum.",
      farmerId: farmerId1,
    },
    {
      name: "Soil pH Tester (Digital)",
      category: "Tools",
      price: 1299,
      mrp: 1799,
      discount: 28,
      quantityAvailable: 22,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1530267981375-f0de93cdf5b8?auto=format&fit=crop&w=800&q=80",
      description: "Digital meter that measures pH, moisture and sunlight. Essential for precision farming.",
      farmerId: farmerId2,
    },
    {
      name: "Hand Cultivator 5-Claw",
      category: "Tools",
      price: 299,
      mrp: 449,
      discount: 33,
      quantityAvailable: 95,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
      description: "5-claw hand cultivator for loosening soil and weeding. Rust-proof steel.",
      farmerId: farmerId1,
    },
    {
      name: "Drip Irrigation Kit (30m)",
      category: "Tools",
      price: 2499,
      mrp: 3499,
      discount: 29,
      quantityAvailable: 12,
      stockStatus: "Low Stock",
      image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80",
      description: "Complete drip irrigation kit for 30m rows. Saves 60% water compared to traditional methods.",
      farmerId: farmerId2,
    },
    {
      name: "Garden Gloves (Premium Leather)",
      category: "Tools",
      price: 249,
      mrp: 349,
      discount: 29,
      quantityAvailable: 150,
      stockStatus: "In Stock",
      image: "https://images.unsplash.com/photo-1589514522688-0cd74d88c4d1?auto=format&fit=crop&w=800&q=80",
      description: "Thick leather palm gloves with breathable back. Puncture resistant for thorny plants.",
      farmerId: farmerId1,
    },
  ];
}

// ─────────────────────────────────────────────
// 2. MAIN SEED FUNCTION
// ─────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // ── Clear existing data ────────────────────
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("🗑️  Cleared all collections");

    // ── Create Users ───────────────────────────
    const passwordHash = await bcrypt.hash("password123", 10);

    const usersData = [
      { username: "admin",    phone: "9000000001", passwordHash, role: "admin" },
      { username: "ramesh",   phone: "9000000002", passwordHash, role: "farmer" },
      { username: "suresh",   phone: "9000000003", passwordHash, role: "farmer" },
      { username: "vikram",   phone: "9000000004", passwordHash, role: "delivery" },
      { username: "priya",    phone: "9000000005", passwordHash, role: "customer" },
      { username: "anita",    phone: "9000000006", passwordHash, role: "customer" },
    ];

    const createdUsers = await User.insertMany(usersData);

    const admin    = createdUsers.find(u => u.username === "admin");
    const farmer1  = createdUsers.find(u => u.username === "ramesh");
    const farmer2  = createdUsers.find(u => u.username === "suresh");
    const delivery = createdUsers.find(u => u.username === "vikram");
    const customer1= createdUsers.find(u => u.username === "priya");
    const customer2= createdUsers.find(u => u.username === "anita");
    console.log("👤 Created 6 users");

    // ── Create Products ────────────────────────
    const productsData = buildProducts(farmer1._id, farmer2._id);
    const createdProducts = await Product.insertMany(productsData);
    console.log(`📦 Created ${createdProducts.length} products`);

    // ── Create Orders ──────────────────────────
    const p = (name) => createdProducts.find(p => p.name.includes(name));

    const ordersData = [
      // Customer 1 — Delivered orders
      {
        farmerId: farmer1._id,
        customerId: customer1._id,
        items: [
          { productId: p("Tomato")._id, name: p("Tomato").name, price: p("Tomato").price, quantity: 2, image: p("Tomato").image },
          { productId: p("Spinach")._id, name: p("Spinach").name, price: p("Spinach").price, quantity: 3, image: p("Spinach").image },
        ],
        status: "delivered",
        totalAmount: p("Tomato").price * 2 + p("Spinach").price * 3,
        deliveryPartnerId: delivery._id,
        deliveryAddress: "14 Green Valley, Kothrud, Pune - 411038",
        deliveryFee: 30,
        createdAt: new Date(Date.now() - 5 * 86400000),
      },
      {
        farmerId: farmer2._id,
        customerId: customer1._id,
        items: [
          { productId: p("Shovel")._id, name: p("Shovel").name, price: p("Shovel").price, quantity: 1, image: p("Shovel").image },
        ],
        status: "delivered",
        totalAmount: p("Shovel").price,
        deliveryPartnerId: delivery._id,
        deliveryAddress: "14 Green Valley, Kothrud, Pune - 411038",
        deliveryFee: 30,
        createdAt: new Date(Date.now() - 10 * 86400000),
      },
      // Customer 1 — Active orders
      {
        farmerId: farmer1._id,
        customerId: customer1._id,
        items: [
          { productId: p("NPK")._id, name: p("NPK").name, price: p("NPK").price, quantity: 2, image: p("NPK").image },
          { productId: p("Neem")._id, name: p("Neem").name, price: p("Neem").price, quantity: 1, image: p("Neem").image },
        ],
        status: "assigned",
        totalAmount: p("NPK").price * 2 + p("Neem").price,
        deliveryPartnerId: delivery._id,
        deliveryAddress: "14 Green Valley, Kothrud, Pune - 411038",
        deliveryFee: 30,
        createdAt: new Date(Date.now() - 1 * 86400000),
      },
      {
        farmerId: farmer2._id,
        customerId: customer1._id,
        items: [
          { productId: p("Corn")._id, name: p("Corn").name, price: p("Corn").price, quantity: 5, image: p("Corn").image },
        ],
        status: "pending",
        totalAmount: p("Corn").price * 5,
        deliveryAddress: "14 Green Valley, Kothrud, Pune - 411038",
        deliveryFee: 0,
        createdAt: new Date(Date.now() - 3600000),
      },
      // Customer 2 — Various orders
      {
        farmerId: farmer1._id,
        customerId: customer2._id,
        items: [
          { productId: p("Pruning")._id, name: p("Pruning").name, price: p("Pruning").price, quantity: 1, image: p("Pruning").image },
          { productId: p("Gloves")._id, name: p("Gloves").name, price: p("Gloves").price, quantity: 2, image: p("Gloves").image },
        ],
        status: "delivered",
        totalAmount: p("Pruning").price + p("Gloves").price * 2,
        deliveryPartnerId: delivery._id,
        deliveryAddress: "7 Sunrise Apts, Baner, Pune - 411045",
        deliveryFee: 30,
        createdAt: new Date(Date.now() - 3 * 86400000),
      },
      {
        farmerId: farmer2._id,
        customerId: customer2._id,
        items: [
          { productId: p("Drip")._id, name: p("Drip").name, price: p("Drip").price, quantity: 1, image: p("Drip").image },
        ],
        status: "assigned",
        totalAmount: p("Drip").price,
        deliveryPartnerId: delivery._id,
        deliveryAddress: "7 Sunrise Apts, Baner, Pune - 411045",
        deliveryFee: 40,
        createdAt: new Date(Date.now() - 86400000 / 2),
      },
      {
        farmerId: farmer1._id,
        customerId: customer2._id,
        items: [
          { productId: p("Vermicompost")._id, name: p("Vermicompost").name, price: p("Vermicompost").price, quantity: 3, image: p("Vermicompost").image },
          { productId: p("pH Tester")._id, name: p("pH Tester").name, price: p("pH Tester").price, quantity: 1, image: p("pH Tester").image },
        ],
        status: "pending",
        totalAmount: p("Vermicompost").price * 3 + p("pH Tester").price,
        deliveryAddress: "7 Sunrise Apts, Baner, Pune - 411045",
        deliveryFee: 0,
        createdAt: new Date(Date.now() - 7200000),
      },
      // More orders for farmers dashboard variety
      {
        farmerId: farmer1._id,
        customerId: customer1._id,
        items: [
          { productId: p("Watermelon")._id, name: p("Watermelon").name, price: p("Watermelon").price, quantity: 2, image: p("Watermelon").image },
          { productId: p("Radish")._id, name: p("Radish").name, price: p("Radish").price, quantity: 4, image: p("Radish").image },
        ],
        status: "delivered",
        totalAmount: p("Watermelon").price * 2 + p("Radish").price * 4,
        deliveryPartnerId: delivery._id,
        deliveryAddress: "14 Green Valley, Kothrud, Pune - 411038",
        deliveryFee: 30,
        createdAt: new Date(Date.now() - 15 * 86400000),
      },
      {
        farmerId: farmer2._id,
        customerId: customer1._id,
        items: [
          { productId: p("Seaweed")._id, name: p("Seaweed").name, price: p("Seaweed").price, quantity: 2, image: p("Seaweed").image },
          { productId: p("Urea")._id, name: p("Urea").name, price: p("Urea").price, quantity: 1, image: p("Urea").image },
        ],
        status: "delivered",
        totalAmount: p("Seaweed").price * 2 + p("Urea").price,
        deliveryPartnerId: delivery._id,
        deliveryAddress: "14 Green Valley, Kothrud, Pune - 411038",
        deliveryFee: 30,
        createdAt: new Date(Date.now() - 8 * 86400000),
      },
      {
        farmerId: farmer1._id,
        customerId: customer2._id,
        items: [
          { productId: p("Chili")._id, name: p("Chili").name, price: p("Chili").price, quantity: 3, image: p("Chili").image },
          { productId: p("Capsicum")._id, name: p("Capsicum").name, price: p("Capsicum").price, quantity: 2, image: p("Capsicum").image },
        ],
        status: "assigned",
        totalAmount: p("Chili").price * 3 + p("Capsicum").price * 2,
        deliveryPartnerId: delivery._id,
        deliveryAddress: "7 Sunrise Apts, Baner, Pune - 411045",
        deliveryFee: 30,
        createdAt: new Date(Date.now() - 1.5 * 86400000),
      },
    ];

    await Order.insertMany(ordersData);
    console.log(`📋 Created ${ordersData.length} orders`);

    await mongoose.disconnect();
    console.log("\n🎉 SEEDING COMPLETE! Summary:");
    console.log("   Users     : 6 (1 admin, 2 farmers, 1 delivery, 2 customers)");
    console.log(`   Products  : ${createdProducts.length} (10 Seeds, 10 Fertilizers, 10 Tools)`);
    console.log(`   Orders    : ${ordersData.length} (mix of pending, assigned, delivered)`);
    console.log("\n📝 Login Credentials:");
    console.log("   admin   / password123  (role: admin)");
    console.log("   ramesh  / password123  (role: farmer)");
    console.log("   suresh  / password123  (role: farmer)");
    console.log("   vikram  / password123  (role: delivery)");
    console.log("   priya   / password123  (role: customer)");
    console.log("   anita   / password123  (role: customer)");

  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seed();
