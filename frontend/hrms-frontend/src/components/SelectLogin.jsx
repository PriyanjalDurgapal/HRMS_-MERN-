import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LOGIN_OPTIONS = [
  { title: "Admin Login", desc: "System & access control", route: "/admin" },
  { title: "Employee Login", desc: "View profile & activity", route: "/employee-login" },
  { title: "Manager Login", desc: "Team & reports access", route: "/manager-login" },
];

export default function SelectLogin() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      
      <div className="absolute top-4 left-4 sm:left-6 max-w-[80%]">
        <p className="text-[10px] sm:text-xs text-gray-300">
          Made by <span className="text-white font-semibold">Priyanjal Durgapal</span>
        </p>
        <p className="text-[10px] sm:text-xs text-gray-400 break-all">
          durgapalpriyanjal@gmail.com
        </p>

        <div className="flex gap-3 mt-1 text-[10px] sm:text-xs">
          <a
            href="https://in.linkedin.com/in/priyanjal-durgapal-257795272"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9f8cff] hover:text-white transition"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/PriyanjalDurgapal/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9f8cff] hover:text-white transition"
          >
            GitHub
          </a>
        </div>
      </div>

      <div
        className={`w-full max-w-5xl bg-[#1b1830] border border-[#6b5ca5] rounded-3xl
        p-6 sm:p-8 md:p-12 transition-all duration-700 transform
        ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="flex justify-center mb-6">
          <img
            src="/PRIYANJAL CONSULTANCY.png"
            alt="Logo"
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-semibold text-center mb-8">
          Select Login Profile
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {LOGIN_OPTIONS.map(({ title, desc, route }) => (
            <div
              key={title}
              className="bg-[#5b4e86] rounded-2xl p-6 sm:p-8 text-center shadow-lg
              transform transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                {title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-200 mb-5">
                {desc}
              </p>

              <button
                onClick={() => navigate(route)}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#4b3b8f] to-[#3a2e70]
                text-sm sm:text-base text-white font-medium hover:opacity-90 transition"
              >
                Continue
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-3 right-4 sm:right-8 max-w-xs sm:max-w-sm text-right">
        <h2 className="text-[10px] sm:text-xs text-gray-200 font-semibold mb-1">
          Enterprise HRMS with Role-Based Access & Real-Time Communication
        </h2>
        <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed">
          Scalable HR platform with authentication, payroll, leave tracking,
          task management, and real-time employee chat built using MERN stack.
        </p>
      </div>

    </div>
  );
}
