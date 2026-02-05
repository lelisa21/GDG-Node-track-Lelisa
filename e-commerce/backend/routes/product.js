const express = require("express");
const router = express.Router();

router.get("/", (req , res) => {
    res.json({message : "Products page"})
})
router.get("/:id", (req , res) => {
    res.json({message : " Specific Product page"})
})

module.exports = router;
