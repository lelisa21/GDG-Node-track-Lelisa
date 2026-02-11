const steps = ["pending", "processing", "shipped", "delivered"]

const OrderProgress = ({ status }) => {
  const currentIndex = steps.indexOf(status)

  return (
    <div className="flex items-center justify-between mt-6">
      {steps.map((step, index) => (
        <div key={step} className="flex-1 text-center">
          <div
            className={`h-2 mb-2 ${
              index <= currentIndex ? "bg-black" : "bg-gray-200"
            }`}
          />
          <p className="text-xs capitalize">{step}</p>
        </div>
      ))}
    </div>
  )
}

export default OrderProgress
