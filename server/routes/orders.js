const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { farmerId, items, totalAmount, deliveryAddress, deliveryLocation } =
      req.body;

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
      deliveryAddress: deliveryAddress || "",
      deliveryLocation: {
        lat: deliveryLocation?.lat ?? null,
        lng: deliveryLocation?.lng ?? null,
      },
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

// Get orders for a specific farmer
router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params;
    const orders = await Order.find({ farmerId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching farmer orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get orders for a specific customer
router.get("/customer/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
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
    // simple fixed fee per delivery for now
    order.deliveryFee = order.deliveryFee || 30;
    await order.save();

    res.status(200).json({ message: "Order accepted successfully", order });
  } catch (error) {
    console.error("Error accepting order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark order as delivered
router.patch("/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryPartnerId } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.deliveryPartnerId &&
      deliveryPartnerId &&
      order.deliveryPartnerId.toString() !== deliveryPartnerId
    ) {
      return res.status(403).json({
        message: "You are not assigned to this order",
      });
    }

    order.status = "delivered";
    await order.save();

    res.json({ message: "Order marked as delivered", order });
  } catch (error) {
    console.error("Error completing order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delivery partner summary (earnings + completed orders)
router.get("/delivery/:partnerId/summary", async (req, res) => {
  try {
    const { partnerId } = req.params;

    const deliveredOrders = await Order.find({
      deliveryPartnerId: partnerId,
      status: "delivered",
    });

    const totalEarnings = deliveredOrders.reduce(
      (sum, order) => sum + (order.deliveryFee || 0),
      0,
    );

    res.json({
      totalEarnings,
      deliveredCount: deliveredOrders.length,
    });
  } catch (error) {
    console.error("Error fetching delivery summary:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delivery partner completed orders list
router.get("/delivery/:partnerId/history", async (req, res) => {
  try {
    const { partnerId } = req.params;

    const deliveredOrders = await Order.find({
      deliveryPartnerId: partnerId,
      status: "delivered",
    }).sort({ createdAt: -1 });

    res.json(deliveredOrders);
  } catch (error) {
    console.error("Error fetching delivery history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
