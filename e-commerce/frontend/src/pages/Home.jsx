import { FaFacebook, FaInstagram, FaTelegram } from "react-icons/fa";
import { Link } from "react-router-dom";
import bgImage from "../assets/hero.png";
import EthiopianFlag from "../components/EthiopianFlag";

export default function Home() {
  // const {products , dispatch} = useProductContext();
  // useEffect(() => {
  //  const fetchProduct = async () => {
  //   try {
  //     const response  = await fetch("http://localhost:4000/api/product");
  //   const data =  response.json()
  //   if(!response.ok){
  //     throw Error("Data Couldn't fetched HTTP request Error")
  //   }
  //   dispatch(products);
  //   } catch (error) {

  //   }
  //  }
  //  fetchProduct();
  // }, [])
  return (
    <div className="bg-[#F7F2EB] text-[#2E1F18] w-[95%] mx-auto ">
      {/* HERO - WHY */}
      <section className=" relative min-h-[70vh]  h-full grid  md:grid-cols-2 gap-12 px-6 md:px-24 py-20 items-center overflow-hidden">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-serif leading-tight">
            Smart Shopping, <br /> Rooted in Ethiopian Life.
          </h1>

          <p className="text-lg text-[#5C4A42] max-w-xl">
            Thoughtfully curated products, fair pricing, and reliable delivery —
            built for everyday life across Ethiopia.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="/products"
              className="bg-[#E9723D] text-white px-8 py-3 rounded-xl shadow hover:shadow-xl hover:-translate-y-0.5 transition"
            >
              Explore Store
            </Link>

            <Link
              to="/categories"
              className="border border-[#2E1F18] px-8 py-3 rounded-xl hover:bg-[#2E1F18] hover:text-white transition"
            >
              View Categories
            </Link>
          </div>

          <div className="flex gap-6 pt-6 text-sm text-[#5C4A42]">
            <span>🚚 Fast Delivery</span>
            <span>💳 Secure Payment</span>
            <span>🛡 Trusted Sellers</span>
          </div>
        </div>

        <div className="bg-[url(assets\im.png)]  w-full flex-1 flex justify-center items-center p-4 bg-scroll  rounded">
          <img
            src={bgImage}
            alt="NaGiza lifestyle"
            className="rounded-xl shadow-2xl object-cover  w-full h-auto  aspect-2/2 md:aspect-2/2 max-w-sm  lg:w-132 transition-all shadow-stone-400 duration-300 "
          />
        </div>
      </section>

      {/* PURPOSE STRIP */}
      <section className="bg-[#2E1F18] text-[#F7F2EB] px-6 md:px-24 py-16">
        <h2 className="text-3xl md:text-4xl font-serif mb-4">
          We Believe Shopping Should Be Simple, Fair, and Local.
        </h2>
        <p className="max-w-3xl text-lg text-[#E5DED6]">
          NaGiza was created to remove confusion, fake products, and delivery
          stress. Our goal is simple: make online shopping reliable, honest, and
          joyful.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-24 py-24">
        <h2 className="text-4xl font-serif mb-14">
          How We Make Shopping Effortless
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ["Curated Selection", "Only carefully chosen products."],
            ["Fair Pricing", "No hidden fees or tricks."],
            ["Reliable Delivery", "Fast and trackable shipping."],
            ["Local Support", "Real humans ready to help."],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="bg-white p-6 rounded-2xl border border-[#E5DED6] hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-xl mb-2">{title}</h3>
              <p className="text-[#5C4A42]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-6 md:px-24 pb-24">
        <h2 className="text-4xl font-serif mb-12">Shop by Category</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "Electronics",
            "Fashion",
            "Home",
            "Beauty",
            "Health",
            "Fitness",
            "Lifestyle",
            "others",
            // products.products.catagory
          ].map((cat) => (
            <div
              key={cat}
              className="relative h-56 rounded-3xl overflow-hidden group"
            >
              <img
                src={`/categories/${cat}.jpg`}
                alt={cat}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-semibold">{cat}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CURATED PICKS */}
      <section className="bg-white px-6 md:px-24 py-24">
        <h2 className="text-4xl font-serif mb-3">Handpicked for You</h2>
        <p className="text-[#5C4A42] mb-12">
          selections chosen for quality, comfort, and everyday value.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* products.products.data */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#F7F2EB] rounded p-4 border border-[#E5DED6] hover:shadow-lg transition duration-500 "
            >
              <img
                src={`/products/${i}.jpg`}
                alt="product"
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="font-semibold"> Product</h3>
              <p className="text-[#E9723D] font-bold">3,500 ETB</p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="px-6 md:px-24 py-24">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-serif mb-6">
            Built for Everyday Ethiopia
          </h2>
          <p className="text-lg text-[#5C4A42] leading-relaxed">
            NaGiza was born from the daily struggles of finding honest products,
            fair prices, and dependable delivery. We’re building a trusted
            digital marketplace that truly serves Ethiopian households.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white px-6 md:px-24 py-24">
        <h2 className="text-4xl font-serif mb-14">What Our Customers Say</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            ["Selam", "Addis Ababa", "Fast delivery and great quality."],
            ["Robel", "Bahir Dar", "Trusted shopping experience."],
            ["Hana", "Mekelle", "Beautiful products and fair pricing."],
          ].map(([name, city, quote]) => (
            <div
              key={name}
              className="bg-[#F7F2EB] p-6 rounded-2xl border border-[#E5DED6]"
            >
              <p className="italic mb-4 text-[#5C4A42]">"{quote}"</p>
              <h4 className="font-semibold">{name}</h4>
              <span className="text-sm text-[#5C4A42]">{city}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#2E1F18] text-[#F7F2EB] text-center px-6 py-24">
        <h2 className="text-4xl font-serif mb-4">
          Your Everyday Shopping, Simplified.
        </h2>
        <p className="text-lg text-[#E5DED6] mb-10">
          Join thousands of Ethiopians who shop smarter every day.
        </p>

        <Link
          to="/products"
          className="bg-[#E9723D] px-12 py-4 rounded-xl shadow hover:shadow-xl transition"
        >
          Start Exploring
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1E1E1E] text-[#F7F2EB] px-6 md:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-serif mb-4">NaGiza</h3>
            <p className="text-sm text-gray-400">
              A modern Ethiopian marketplace built on trust, quality, and
              simplicity.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Home</li>
              <li>Categories</li>
              <li>Products</li>
              <li>Cart</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Help Center</li>
              <li>Returns</li>
              <li>Shipping</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Follow</h4>
            <ul className="space-y-2 text-gray-400 text-sm ">
              <li className="flex  items-center  gap-1">
                <FaTelegram />
                Telegram
              </li>
              <li className="flex  items-center gap-1">
                {" "}
                <FaFacebook />
                Facebook
              </li>
              <li className="flex  items-center gap-1">
                <FaInstagram />
                Instagram
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-12 pt-6 text-sm text-gray-500 text-center  grid grid-cols-2   items-center ">
          © {new Date().getFullYear()} NaGiza — Proudly Ethiopian{" "}
          <EthiopianFlag width="25" />
        </div>
      </footer>
    </div>
  );
}
