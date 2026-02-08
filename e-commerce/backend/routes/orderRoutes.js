import express from "express"
import * as orderController from "../controllers/ordersController.js"

const router = express.Router();

router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrder);
router.get("/stats" , orderController.getOrderStats)

router.post("/", orderController.createOrder);
router.delete("/:id", orderController.cancelOrder);

export default router;
