const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

const productRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");
const ordersRouter = require("./routes/ordersRoutes");
const errorHandler = require("./middleware/errorHandler");
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(express.json());

// routes
app.use("/products" , productRouter);
app.use("/cart" , cartRouter);
app.use("/orders" , ordersRouter);

// for images
app.use("/uploads", express.static("src/uploads"));
app.use(errorHandler)

app.get("/" , (req , res) => {
    res.status(200).json({message : "Hi welcome to home page"})
})

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(port, () => {
  console.log(`App is runnig on port http://localhost:${port}/`);
});  
}).catch(error => {console.error("DB Connection failed" , error.message)})

