const express = require("express");
const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/ordersController");

const validateOrder = require("../middleware/validateOrder");

const router = express.Router();

router.post("/", validateOrder, createOrder);
router.get("/", getOrders);
router.put("/:id/status", updateOrderStatus);

module.exports = router;
