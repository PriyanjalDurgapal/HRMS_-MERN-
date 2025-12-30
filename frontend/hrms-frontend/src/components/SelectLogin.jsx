import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LOGIN_OPTIONS = [
  { title: "Admin Login", desc: "System & access control", route: "/admin" },
  { title: "Employee Login", desc: "View profile & activity", route: "/employee-login" },
];

export default function SelectLogin() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0c1d] to-black flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">

      {/* Top Branding */}
      <div className="absolute top-4 left-4 sm:left-6 max-w-[85%]">
        <p className="text-[10px] sm:text-xs text-gray-400">
          Crafted by -  <span className="text-white font-semibold">Priyanjal Durgapal</span>
        </p>
        <p className="text-[10px] sm:text-xs text-gray-500 break-all">
          durgapalpriyanjal@gmail.com
        </p>

        <div className="flex gap-4 mt-1 text-[10px] sm:text-xs">
          <a
            href="https://in.linkedin.com/in/priyanjal-durgapal-257795272"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#a89cff] hover:text-white transition"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/PriyanjalDurgapal/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#a89cff] hover:text-white transition"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* Main Card */}
      <div
        className={`w-full max-w-5xl bg-[#17152a]/90 backdrop-blur-xl
        border border-[#6b5ca5]/40 rounded-3xl
        p-6 sm:p-8 md:p-12 transition-all duration-700 transform
        ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <img
            src="/PRIYANJAL CONSULTANCY.png"
            alt="Logo"
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl shadow-md"
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-semibold text-center mb-2">
          Select Login Profile
        </h1>
        <p className="text-center text-xs sm:text-sm text-gray-400 mb-8">
          Choose your access role to continue
        </p>

        {/* Login Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {LOGIN_OPTIONS.map(({ title, desc, route }) => (
            <div
              key={title}
              className="bg-gradient-to-br from-[#5f55a5] to-[#433a78]
              rounded-2xl p-6 sm:p-8 text-center shadow-xl
              transform transition-all duration-300
              hover:-translate-y-2 hover:shadow-2xl hover:from-[#6a5bd6] hover:to-[#4a3aa1]"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                {title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-200 mb-6">
                {desc}
              </p>

              <button
                onClick={() => navigate(route)}
                className="w-full py-2.5 sm:py-3 rounded-xl
                bg-black/30 backdrop-blur
                text-sm sm:text-base text-white font-medium
                border border-white/20
                hover:bg-black/40 hover:border-white/40 transition"
              >
                Continue
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Description */}
      <div className="absolute bottom-3 right-4 sm:right-8 max-w-xs sm:max-w-sm text-right">
        <h2 className="text-[10px] sm:text-xs text-gray-300 font-semibold mb-1">
          Enterprise HRMS Platform
        </h2>
        <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">
          Role-based authentication, payroll, leave tracking, task management,
          and real-time employee communication built on MERN stack.
        </p>
      </div>
    </div>
  );
}
