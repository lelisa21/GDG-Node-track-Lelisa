const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true, 
        },
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },

    status: {
      type: String,
      enum: ["created", "confirmed", "shipped", "delivered", "cancelled"],
      default: "created",
    },

    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
