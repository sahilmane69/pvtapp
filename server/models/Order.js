const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      image: { type: String, default: "" },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "assigned", "delivered"],
    default: "pending",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryPartnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  deliveryAddress: {
    type: String,
    default: "",
  },
  deliveryLocation: {
    lat: {
      type: Number,
      default: null,
    },
    lng: {
      type: Number,
      default: null,
    },
  },
  deliveryFee: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
