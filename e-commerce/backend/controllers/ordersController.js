const Order = require("../models/OrdersModel");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

// CREATE ORDER FROM CART
const createOrder = async (req, res, next) => {
  try {
    const { cartId, customer } = req.body;

    const cart = await Cart.findById(cartId).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    const items = [];

    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({
          message: "One or more products in cart no longer exist",
        });
      }

      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}`,
        });
      }

      item.product.stock -= item.quantity;
      await item.product.save();

      items.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      });

      total += item.product.price * item.quantity;
    }

    const order = await Order.create({
      items,
      total,
      customer,
      cartId,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// GET ALL ORDERS
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// UPDATE ORDER STATUS (ADMIN STYLE)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
