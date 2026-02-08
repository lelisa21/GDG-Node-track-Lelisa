import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig.js";
import porductRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "E-Commerce API",
    version: "1.0.0",
    endpoints: {
      products: "/products",
      cart: "/cart",
      orders: "/orders",
    },
  });
});

// routes
app.use("/products", porductRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Error 404 handler
app.use(`/{*path}`, (req, res) => {
  res.status(404).json({
    error: "Route not Found",
    path: req.originalUrl,
  });
});

// Server error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "something went wrong",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
  next()
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`server running on port http://localhost:${port}/`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};


startServer()
