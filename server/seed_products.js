const mongoose = require("mongoose");
const Product = require("./models/Product");

const uri = "mongodb://localhost:27017/farmingo";

const products = [
  {
    name: "Premium Tomato Seeds",
    category: "Seeds",
    price: 450,
    quantityAvailable: 100,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=800",
    description: "High-yield hybrid tomato seeds suitable for all seasons. Disease resistant.",
  },
  {
    name: "Organic Spinach Seeds",
    category: "Seeds",
    price: 120,
    quantityAvailable: 200,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800",
    description: "Fast-growing spinach variety rich in iron. Harvest in 45 days.",
  },
  {
    name: "Golden Corn Seeds",
    category: "Seeds",
    price: 350,
    quantityAvailable: 150,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800",
    description: "Sweet corn variety with large kernels. Excellent for boiling and roasting.",
  },
  {
    name: "Cucumber Seeds",
    category: "Seeds",
    price: 180,
    quantityAvailable: 120,
    image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&q=80&w=800",
    description: "Crisp and juicy cucumbers, perfect for salads. High germination rate.",
  },
  {
    name: "Chili Pepper Seeds",
    category: "Seeds",
    price: 200,
    quantityAvailable: 80,
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=800",
    description: "Spicy chili variety. ideal for hot climates.",
  },
  {
    name: "NPK 19-19-19 Fertilizer",
    category: "Fertilizers",
    price: 1200,
    quantityAvailable: 50,
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=800",
    description: "Balanced fertilizer for overall plant growth. Water soluble.",
  },
  {
    name: "Urea 46%",
    category: "Fertilizers",
    price: 800,
    quantityAvailable: 100,
    image: "https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?auto=format&fit=crop&q=80&w=800",
    description: "High nitrogen content for lush green foliage. Fast acting.",
  },
  {
    name: "Organic Compost",
    category: "Fertilizers",
    price: 400,
    quantityAvailable: 300,
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800",
    description: "100% organic decomposed matter. Improves soil structure.",
  },
  {
    name: "Neem Cake",
    category: "Fertilizers",
    price: 600,
    quantityAvailable: 80,
    image: "https://images.unsplash.com/photo-1589923188900-85dae5233f71?auto=format&fit=crop&q=80&w=800",
    description: "Natural fertilizer and pest repellent. Eco-friendly.",
  },
  {
    name: "Heavy Duty Shovel",
    category: "Tools",
    price: 950,
    quantityAvailable: 30,
    image: "https://images.unsplash.com/photo-1416879115507-1961852e6157?auto=format&fit=crop&q=80&w=800",
    description: "Durable steel shovel with wooden handle. Essential for digging.",
  },
  {
    name: "Pruning Shears",
    category: "Tools",
    price: 550,
    quantityAvailable: 45,
    image: "https://images.unsplash.com/photo-1598512114175-5873a4365611?auto=format&fit=crop&q=80&w=800",
    description: "Sharp bypass pruners for trimming plants and bushes.",
  },
  {
    name: "Watering Can (5L)",
    category: "Tools",
    price: 350,
    quantityAvailable: 60,
    image: "https://images.unsplash.com/photo-1463320726281-696a4137048a?auto=format&fit=crop&q=80&w=800",
    description: "Plastic watering can with rose head for gentle watering.",
  },
  {
    name: "Garden Rake",
    category: "Tools",
    price: 700,
    quantityAvailable: 25,
    image: "https://images.unsplash.com/photo-1589051039495-2c930500d43a?auto=format&fit=crop&q=80&w=800",
    description: "Sturdy rake for leveling soil and collecting debris.",
  },
  {
    name: "Knapsack Sprayer (16L)",
    category: "Equipment",
    price: 2500,
    quantityAvailable: 15,
    image: "https://images.unsplash.com/photo-1530267981375-f0de93cdf5b8?auto=format&fit=crop&q=80&w=800",
    description: "Manual backpack sprayer for pesticides and fertilizers.",
  },
  {
    name: "Seed Drill",
    category: "Equipment",
    price: 4500,
    quantityAvailable: 5,
    image: "https://plus.unsplash.com/premium_photo-1664304899127-994362140656?auto=format&fit=crop&q=80&w=800",
    description: "Precision seed sowing machine. Saves time and labor.",
  },
];

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert new products
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products successfully`);

    await mongoose.disconnect();
    console.log("Disconnected");
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
