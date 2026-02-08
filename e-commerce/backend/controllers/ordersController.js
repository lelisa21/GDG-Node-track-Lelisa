import Order from '../models/OrderModel.js';
import Cart from '../models/CartModel.js';
import Product from '../models/ProductModel.js';
import { ApiResponse } from '../utils/apiResponse.js';

const getSessionId = (req) => {
  return req.headers['x-session-id'] || req.cookies?.sessionId || 'guest';
};

export const createOrder = async (req, res) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const sessionId = getSessionId(req);
    const { customer } = req.body;

    // Validate required fields
    if (!customer?.name || !customer?.email) {
      await session.abortTransaction();
      return res.status(400).json(
        ApiResponse.error('Customer name and email are required')
      );
    }

    // Get cart
    const cart = await Cart.findOne({ sessionId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json(ApiResponse.error('Cart is empty'));
    }

    // Validate stock and prepare order items
    const orderItems = [];
    const stockUpdates = [];

    for (const item of cart.items) {
      if (!item.product || !item.product.isActive) {
        await session.abortTransaction();
        return res.status(400).json(
          ApiResponse.error(`Product ${item.product?._id || 'unknown'} is no longer available`)
        );
      }

      if (item.product.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json(
          ApiResponse.error(`Insufficient stock for ${item.product.name}`)
        );
      }

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        priceAtPurchase: item.product.price
      });

      stockUpdates.push({
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { stock: -item.quantity } }
        }
      });
    }

    // Update stock
    await Product.bulkWrite(stockUpdates, { session });

    // Calculate totals
    const subtotal = orderItems.reduce(
      (sum, item) => sum + (item.priceAtPurchase * item.quantity), 0
    );
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Create order
    const order = new Order({
      sessionId,
      customer,
      items: orderItems,
      tax,
      shipping,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    await order.save({ session });

    // Clear cart
    await Cart.findOneAndDelete({ sessionId }).session(session);

    await session.commitTransaction();

    const populatedOrder = await order.populate('items.product');

    res.status(201).json(ApiResponse.success(populatedOrder, 'Order created successfully'));

  } catch (error) {
    await session.abortTransaction();
    console.error('Order creation error:', error);
    res.status(400).json(ApiResponse.error(error.message));
  } finally {
    session.endSession();
  }
};

export const getOrders = async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { page = 1, limit = 10, status } = req.query;

    const filter = { sessionId };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .populate('items.product'),
      Order.countDocuments(filter)
    ]);

    res.json(ApiResponse.paginated(orders, page, limit, total));

  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

export const getOrder = async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const order = await Order.findOne({
      _id: req.params.id,
      sessionId
    }).populate('items.product');

    if (!order) {
      return res.status(404).json(ApiResponse.error('Order not found'));
    }

    res.json(ApiResponse.success(order));

  } catch (error) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

export const cancelOrder = async (req, res) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const sessionId = getSessionId(req);
    const order = await Order.findOne({
      _id: req.params.id,
      sessionId,
      status: { $in: ['pending', 'processing'] }
    });

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json(
        ApiResponse.error('Order not found or cannot be cancelled')
      );
    }

    // Restock items
    const stockUpdates = order.items.map(item => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: item.quantity } }
      }
    }));

    if (stockUpdates.length > 0) {
      await Product.bulkWrite(stockUpdates, { session });
    }

    // Update order status
    order.status = 'cancelled';
    await order.save({ session });

    await session.commitTransaction();

    res.json(ApiResponse.success(null, 'Order cancelled successfully'));

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json(ApiResponse.error(error.message));
  } finally {
    session.endSession();
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    
    const stats = await Order.aggregate([
      { $match: { sessionId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          }
        }
      }
    ]);

    const recentOrders = await Order.find({ sessionId })
      .sort('-createdAt')
      .limit(5)
      .populate('items.product');

    res.json(ApiResponse.success({
      overview: stats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        avgOrderValue: 0,
        pendingOrders: 0
      },
      recentOrders
    }));

  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};
