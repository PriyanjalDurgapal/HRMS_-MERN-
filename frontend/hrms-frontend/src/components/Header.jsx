import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModal";
import { getUser } from "../util/auth";

const Header = ({ userName, toggleSidebar }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => navigate("/logout");

  return (
    <>
      <header className="w-full bg-gray-800 shadow-lg border-b border-gray-700 flex items-center justify-between px-4 py-4 md:py-5 gap-4">
        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden p-2 bg-gray-700 rounded text-white"
          onClick={toggleSidebar}
        >
          Menu
        </button>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-violet-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl uppercase shadow-md">
            {user?.name?.[0] || "U"}
            <div className="absolute inset-0 rounded-full bg-purple-600 opacity-30 blur-xl"></div>
          </div>
          <div className="text-sm sm:text-base">
            <p className="text-white font-medium">Welcome back,</p>
            <p className="text-white font-bold text-lg sm:text-xl">{user?.name || "User"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-gray-100 text-xs sm:text-sm font-medium px-3 py-1 rounded-full capitalize">
            {user?.role || "User"}
          </span>

          <button
            onClick={() => setShowChangePassword(true)}
            className="bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-105 transition"
          >
            Change Password
          </button>

          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-105 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
    </>
  );
};

export default Header;
