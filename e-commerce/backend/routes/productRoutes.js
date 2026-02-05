const express = require("express");
const router = express.Router();
const productValidator = require("../middleware/productValidator");

const { getAllProducts,getProduct,createProduct,deleteProduct,updateProduct} = require("../controllers/productController");

router.get("/", getAllProducts)
router.get("/:id", getProduct);
router.post("/" ,productValidator, createProduct);
router.delete("/:id" , deleteProduct);
router.put("/:id" , updateProduct);

module.exports = router;
