const express = require("express");

const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/orders");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(express.json());

// routes
app.use("/products" , productRouter);
app.use("/cart" , cartRouter);
app.use("/orders" , ordersRouter);

app.get("/" , (req , res) => {
    res.status(200).json({message : "Hi wel come to home page"})
})

app.listen(port, () => {
  console.log(`App is runnig on port http://localhost:${port}/`);
});
