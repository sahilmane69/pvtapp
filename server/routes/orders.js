const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { farmerId, items, totalAmount } = req.body;

    if (!farmerId || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Farmer ID and items are required" });
    }

    const newOrder = new Order({
      farmerId,
      items,
      totalAmount: totalAmount || 0, // Should be calculated or passed from frontend
      status: "pending",
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      orderId: savedOrder._id,
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get pending orders for delivery
router.get("/delivery", async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: "pending" }).populate(
      "farmerId",
      "phone",
    );
    res.status(200).json(pendingOrders);
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Accept an order
router.patch("/:id/accept", async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;
    const orderId = req.params.id;

    if (!deliveryPartnerId) {
      return res
        .status(400)
        .json({ message: "Delivery Partner ID is required" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Order is already assigned or delivered" });
    }

    order.status = "assigned";
    order.deliveryPartnerId = deliveryPartnerId;
    await order.save();

    res.status(200).json({ message: "Order accepted successfully", order });
  } catch (error) {
    console.error("Error accepting order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
