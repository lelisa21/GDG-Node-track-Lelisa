const validateOrder = (req, res, next) => {
  const { cartId, customer } = req.body;

  if (!cartId) {
    return res.status(400).json({ message: "cartId is required" });
  }

  if (
    !customer ||
    !customer.name ||
    !customer.phone ||
    !customer.address
  ) {
    return res.status(400).json({
      message: "Customer name, phone and address are required",
    });
  }

  next();
};

module.exports = validateOrder;
