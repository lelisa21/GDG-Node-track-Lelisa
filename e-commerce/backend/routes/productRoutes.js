import express from "express"
import * as productController from "../controllers/productController.js"

const router = express.Router();

router.get("/", productController.getProducts)
router.get("/:id", productController.getProduct);
router.get("/stats" , productController.getProductStats)
router.post("/" ,productController.createProduct);
router.delete("/:id" , productController.deleteProduct);
router.put("/:id" , productController.updateProduct);

export default router;
