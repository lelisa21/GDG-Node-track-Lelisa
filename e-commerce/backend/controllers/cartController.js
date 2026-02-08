import Cart from '../models/CartModel.js';
import Product from '../models/ProductModel.js';
import { ApiResponse } from '../utils/apiResponse.js';

const getSessionId = (req) => {
  return req.headers['x-session-id'] || req.cookies?.sessionId || 'guest';
};

export const getCart = async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const cart = await Cart.findBySession(sessionId);
    
    res.json(ApiResponse.success(cart));

  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const sessionId = getSessionId(req);

    // Validate product
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json(ApiResponse.error('Product not available'));
    }

    if (product.stock < quantity) {
      return res.status(400).json(
        ApiResponse.error(`Only ${product.stock} items available`)
      );
    }

    // Get or create cart
    let cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      cart = new Cart({ 
        sessionId, 
        items: [{ product: productId, quantity }] 
      });
    } else {
      const existingIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (existingIndex > -1) {
        const newQuantity = cart.items[existingIndex].quantity + quantity;
        if (newQuantity > 99) {
          return res.status(400).json(
            ApiResponse.error('Maximum quantity per product is 99')
          );
        }
        cart.items[existingIndex].quantity = newQuantity;
      } else {
        if (cart.items.length >= 50) {
          return res.status(400).json(
            ApiResponse.error('Cart cannot have more than 50 different products')
          );
        }
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product');

    res.json(ApiResponse.success(populatedCart, 'Item added to cart'));

  } catch (error) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    const sessionId = getSessionId(req);

    if (quantity < 1 || quantity > 99) {
      return res.status(400).json(
        ApiResponse.error('Quantity must be between 1 and 99')
      );
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json(ApiResponse.error('Product not available'));
    }

    if (product.stock < quantity) {
      return res.status(400).json(
        ApiResponse.error(`Only ${product.stock} items available`)
      );
    }

    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json(ApiResponse.error('Cart not found'));
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json(ApiResponse.error('Product not in cart'));
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    const populatedCart = await cart.populate('items.product');

    res.json(ApiResponse.success(populatedCart, 'Cart updated'));

  } catch (error) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const sessionId = getSessionId(req);

    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json(ApiResponse.error('Cart not found'));
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json(ApiResponse.error('Product not in cart'));
    }

    if (cart.items.length === 0) {
      await Cart.findOneAndDelete({ sessionId });
      return res.json(ApiResponse.success(null, 'Cart is empty'));
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product');

    res.json(ApiResponse.success(populatedCart, 'Item removed'));

  } catch (error) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

export const clearCart = async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    await Cart.findOneAndDelete({ sessionId });
    
    res.json(ApiResponse.success(null, 'Cart cleared'));

  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

export const getCartSummary = async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const cart = await Cart.findOne({ sessionId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.json(ApiResponse.success({
        itemCount: 0,
        totalQuantity: 0,
        subtotal: 0,
        isEmpty: true
      }));
    }

    const summary = cart.items.reduce((acc, item) => {
      if (item.product) {
        acc.itemCount++;
        acc.totalQuantity += item.quantity;
        acc.subtotal += item.product.price * item.quantity;
      }
      return acc;
    }, { itemCount: 0, totalQuantity: 0, subtotal: 0 });

    res.json(ApiResponse.success({
      ...summary,
      isEmpty: false,
      estimatedTax: summary.subtotal * 0.08, // 8% tax example
      estimatedTotal: summary.subtotal * 1.08
    }));

  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};
