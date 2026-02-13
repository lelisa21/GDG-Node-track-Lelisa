const OrderSummary = ({ subtotal }) => {
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <aside className="h-fit rounded-3xl border border-[#E5DED6] bg-white p-6 shadow-[0_16px_35px_rgba(46,31,24,0.07)]">
      <h3 className="font-serif text-2xl text-[#2E1F18]">Order Summary</h3>

      <div className="mt-6 space-y-3 text-sm text-[#5C4A42]">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-[#2E1F18]">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Tax ({Math.round(taxRate * 100)}%)</span>
          <span className="font-medium text-[#2E1F18]">${tax.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span className="font-medium text-[#2E1F18]">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-[#E5DED6] pt-4 text-base font-semibold text-[#2E1F18]">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <p className="mt-5 rounded-xl bg-[#F7F2EB] px-4 py-3 text-xs text-[#5C4A42]">
        Secure processing and confirmation happen immediately after payment.
      </p>
    </aside>
  );
};

export default OrderSummary;
