const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for development
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/farmingo")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/auth", require("./routes/auth"));
app.use("/orders", require("./routes/orders"));
app.use("/products", require("./routes/products"));

app.get("/", (req, res) => {
  res.send("Server running");
});

// Socket.io Events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a room for a specific order (both farmer and delivery partner)
  socket.on("join_order", (orderId) => {
    socket.join(orderId);
    console.log(`User ${socket.id} joined order room: ${orderId}`);
  });

  // Delivery partner accepts order
  socket.on("accept_order", (data) => {
    // data: { orderId, deliveryPartnerId }
    io.to(data.orderId).emit("order_accepted", data);
    console.log(`Order ${data.orderId} accepted by ${data.deliveryPartnerId}`);
  });

  // Delivery partner updates location
  socket.on("update_location", (data) => {
    // data: { orderId, latitude, longitude }
    io.to(data.orderId).emit("driver_location", data);
    console.log(
      `Location update for order ${data.orderId}: ${data.latitude}, ${data.longitude}`,
    );
  });

  // Order status update (e.g., delivered)
  socket.on("update_status", (data) => {
    // data: { orderId, status }
    io.to(data.orderId).emit("status_update", data);
    console.log(`Status update for order ${data.orderId}: ${data.status}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Pass io instance to request object if needed later (middleware)
app.use((req, res, next) => {
  req.io = io;
  next();
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
