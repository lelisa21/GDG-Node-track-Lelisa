const express = require("express");
const router = express.Router();

router.get("/", (req , res) => {
    res.json({message : "cart page"})
})
router.get("/:id", (req , res) => {
    res.json({message : " Specific cart page"})
})

module.exports = router;
