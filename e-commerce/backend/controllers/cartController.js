const Cart = require("../models/CartModel");

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
 let cart = await Cart.findOne();

    if (!cart) {
      cart = await Cart.create({
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne().populate("items.product");

    if (!cart) {
      return res.status(404).json({ error: "Cart empty" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne();

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete();
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
};
