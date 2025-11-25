import React from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-md shadow-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="bg-[#B57C36] rounded-full w-10 h-10 flex items-center justify-center shadow-md">
              <span className="text-white font-bold">PL</span>
            </div>
            <span className="text-xl font-bold text-[#B57C36]">
              PharmaLink POS
            </span>
          </div>
          <div className="space-x-6 text-sm font-medium text-gray-700">
            <button
              onClick={() => navigate("/admin/login")}
              className="bg-[#B57C36] text-white font-bold px-6 py-3 rounded-full shadow-lg 
               hover:bg-[#9E6B2F] transform hover:scale-105 transition-all duration-300 
               animate-bounce"
            >
              GET STARTED
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
 <section className="relative mt-[72px] overflow-hidden">
  {/* Decorative background glow */}
  <div className="absolute top-10 left-10 w-40 h-40 bg-[#B57C36]/30 rounded-full blur-3xl animate-pulse"></div>
  <div className="absolute bottom-20 right-10 w-56 h-56 bg-yellow-400/20 rounded-full blur-2xl animate-ping"></div>

  <Carousel
    autoPlay
    infiniteLoop
    showThumbs={false}
    showStatus={false}
    interval={5000}
    swipeable
    emulateTouch
  >
    {/* Slide 1 */}
    <div
      className="relative h-[600px] bg-cover bg-center"
      style={{ backgroundImage: "url('/images/pharmacy1.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 flex flex-col items-center justify-center text-center text-white px-6">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[#B57C36] to-yellow-400 bg-clip-text text-transparent animate-fadeIn">
          Streamline Your Pharmacy Operations
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mb-6 animate-slideUp">
          Manage inventory, sales, and billing seamlessly with PharmaLink POS.
        </p>
        <button
          onClick={() => navigate("/admin/login")}
          className="bg-[#B57C36] text-white font-semibold py-3 px-10 rounded-full shadow-xl 
                     transform hover:scale-105 transition-all duration-300 animate-pulseGlow"
        >
          Get Started
        </button>
      </div>
    </div>

    {/* Slide 2 */}
    <div
      className="relative h-[600px] bg-cover bg-center"
      style={{ backgroundImage: "url('/images/pharmacy2.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 flex flex-col items-center justify-center text-center text-white px-6">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
          Track Stock in Real Time
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mb-6 animate-slideUp">
          Stay ahead with smart alerts for low stock and expiry dates.
        </p>
      </div>
    </div>

    {/* Slide 3 */}
    <div
      className="relative h-[600px] bg-cover bg-center"
      style={{ backgroundImage: "url('/images/pharmacy3.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 flex flex-col items-center justify-center text-center text-white px-6">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
          Simplify Sales & Billing
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mb-6 animate-slideUp">
          Fast, accurate transactions with discounts and VAT handled automatically.
        </p>
      </div>
    </div>
  </Carousel>
</section>



      {/* About Us Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <img
            src="/images/about-us.jpg"
            alt="PharmaLink team"
            className="rounded-xl shadow-2xl object-cover w-full h-[350px]"
          />
        </div>
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold text-[#B57C36] mb-6">About Us</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            PharmaLink POS was founded in 2025 with a bold vision: to
            revolutionize how chemists and pharmacies manage sales through smart
            automation. We provide a powerful point‑of‑sale solution that
            simplifies inventory tracking, branch management, and customer
            service, all while ensuring compliance and accuracy. More than just
            software, PharmaLink POS is a growth partner — helping pharmacies
            embrace digital transformation, boost efficiency, and deliver
            exceptional care.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 text-center bg-gradient-to-r from-white/60 to-gray-100/60">
        <h2 className="text-4xl font-bold text-[#B57C36] mb-12">
          Core Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              title: "Manage Stock",
              desc: "Track inventory, set reorder levels, and monitor expiry dates.",
            },
            {
              title: "Process Sales",
              desc: "Handle transactions, apply discounts, and generate receipts instantly.",
            },
            {
              title: "Manage Users",
              desc: "Add staff accounts, assign roles, and monitor activity securely.",
            },
            {
              title: "Manage Branches",
              desc: "Oversee multiple pharmacy branches with centralized reporting.",
            },
            {
              title: "Analytics & Reports",
              desc: "Gain insights with sales trends, profit margins, and stock movement reports.",
            },
            {
              title: "Secure Access",
              desc: "Role-based permissions and encrypted data keep your business safe.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="glass p-8 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-xl font-semibold text-[#B57C36] mb-4">
                {f.title}
              </h3>
              <p className="text-gray-700">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#B57C36]/10 to-[#B57C36]/20 text-center">
        <h2 className="text-4xl font-bold text-[#B57C36] mb-6">
          Why Choose PharmaLink?
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg">
          PharmaLink POS is designed to simplify pharmaceutical management. From
          stock tracking to billing, our system ensures efficiency, accuracy,
          and compliance — helping your pharmacy thrive.
        </p>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-bold text-[#B57C36] mb-8">Get in Touch</h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-[#B57C36] mb-2">
              Location
            </h3>
            <p className="text-gray-700">Nairobi, Kenya</p>
          </div>
          <div className="glass p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-[#B57C36] mb-2">Email</h3>
            <p className="text-gray-700">support@pharmalink.com</p>
          </div>
          <div className="glass p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-[#B57C36] mb-2">Phone</h3>
            <p className="text-gray-700">+254 700 123 456</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#B57C36] text-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          {/* Left side */}
          <p className="text-sm">
            © {new Date().getFullYear()} PharmaLink POS. All rights reserved.
          </p>

          {/* Right side */}
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <a href="mailto:support@pharmalink.com" className="hover:underline">
              support@pharmalink.com
            </a>
            <span className="hidden md:inline">|</span>
            <p>
              Powered by <span className="font-semibold">Kevs Solutions</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
