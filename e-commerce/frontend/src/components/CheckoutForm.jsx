import { useState } from "react"

const CheckoutForm = ({ onSubmit, submitError }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: ""
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setLoading(true)
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#E5DED6] bg-[#F7F2EB] shadow-[0_20px_45px_rgba(46,31,24,0.08)]">
      <div className="h-2 bg-gradient-to-r from-[#2E1F18] via-[#5C4A42] to-[#E9723D]" />

      <div className="p-8">
        <h2 className="font-serif text-3xl text-[#2E1F18]">Checkout Details</h2>
        <p className="mt-2 text-sm text-[#5C4A42]">
          Add your delivery details and we will process your order instantly.
        </p>

        {submitError && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2E1F18]">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#D8CCC1] bg-white px-4 py-3 text-[#2E1F18] outline-none ring-[#E9723D] transition focus:ring-2"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2E1F18]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#D8CCC1] bg-white px-4 py-3 text-[#2E1F18] outline-none ring-[#E9723D] transition focus:ring-2"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2E1F18]">
              Phone (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#D8CCC1] bg-white px-4 py-3 text-[#2E1F18] outline-none ring-[#E9723D] transition focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2E1F18]">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#D8CCC1] bg-white px-4 py-3 text-[#2E1F18] outline-none ring-[#E9723D] transition focus:ring-2"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-500">{errors.city}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#2E1F18] py-3 font-semibold text-[#F7F2EB] transition hover:bg-[#E9723D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CheckoutForm
