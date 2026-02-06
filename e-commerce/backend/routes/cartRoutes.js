const express = require("express");
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const cartAuth = require("../middleware/cartAuth");

const router = express.Router();

// router.use(cartAuth);

router.post("/", addToCart);
router.get("/", getCart);
router.delete("/remove", removeFromCart);
router.delete("/clear", clearCart);

module.exports = router;
