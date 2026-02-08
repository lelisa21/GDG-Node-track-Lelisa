import express from "express"
import {getCart , getCartSummary , addToCart , updateCartItem, removeFromCart, clearCart} from "../controllers/cartController.js"
const router = express.Router();

// router.use(cartAuth);
router.get("/" , getCart)
router.get("/summary" , getCartSummary)
router.post("/", addToCart);
router.put("/:productId" , updateCartItem)

router.delete("/:productId", removeFromCart);
router.delete("/" , clearCart)

export default  router;
