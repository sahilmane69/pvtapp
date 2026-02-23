const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  console.log("GET /products request received");
  try {
    const { farmerId } = req.query;
    const filter = farmerId ? { farmerId } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new product
router.post("/", async (req, res) => {
  try {
    const { name, category, price, quantityAvailable, farmerId } = req.body;

    if (!name || !category || price == null || quantityAvailable == null) {
      return res
        .status(400)
        .json({ message: "Name, category, price and quantity are required" });
    }

    const product = new Product({
      name,
      category,
      price,
      quantityAvailable,
      farmerId
    });

    const saved = await product.save();

    res.status(201).json({
      message: "Product created",
      product: {
        id: saved._id,
        name: saved.name,
        category: saved.category,
        price: saved.price,
        quantityAvailable: saved.quantityAvailable,
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

