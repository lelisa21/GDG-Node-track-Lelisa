const express = require("express");
const router = express.Router();

router.get("/", (req , res) => {
    res.json({message : "orders page"})
})
router.get("/:id", (req , res) => {
    res.json({message : " Specific order page"})
})

module.exports = router;
