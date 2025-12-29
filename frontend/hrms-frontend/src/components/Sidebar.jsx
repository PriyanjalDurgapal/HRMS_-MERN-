import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useUnread } from "../context/UnreadContext";

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const { totalUnread } = useUnread();

  return (
    <div
      className={`
        ${isSidebarVisible ? "block" : "hidden"} md:block
        ${isOpen ? "w-64" : "w-20"}
        h-screen bg-gray-800 text-white flex flex-col
        transition-all duration-300 overflow-hidden
      `}
    >
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className="md:hidden p-3 bg-gray-700 hover:bg-gray-600 fixed top-4 left-4 z-50 rounded"
      >
        Menu
      </button>

      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className={`font-bold text-2xl ${!isOpen && "hidden"}`}>HRMS</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded hover:bg-gray-700"
        >
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      <nav className="flex-1 p-2 sm:p-4 space-y-2 overflow-y-auto">
        {role === "admin" && (
          <>
            <SidebarLink to="/dashboard" isOpen={isOpen} iconLetter="D" label="Dashboard" />
            <SidebarLink to="/add-employee" isOpen={isOpen} iconLetter="A" label="Add Employee" />
            <SidebarLink to="/all-employees" isOpen={isOpen} iconLetter="A" label="All Employees" />
            <SidebarLink to="/leaves" isOpen={isOpen} iconLetter="L" label="Leaves" />
            <SidebarLink to="/attendence" isOpen={isOpen} iconLetter="A" label="Attendance" />
            <SidebarLink to="/admin/payroll" isOpen={isOpen} iconLetter="P" label="Payroll" />
            <SidebarLink to="/admin/assign-task" isOpen={isOpen} iconLetter="T" label="Tasks" />
            <SidebarLink to="/admin/login-logs" isOpen={isOpen} iconLetter="L" label="Login Logs" />
            <SidebarLink to="/chat" isOpen={isOpen} iconLetter="C" label="Chat" badge={totalUnread} />
          </>
        )}
        {role === "hr" && (
          <>
            <SidebarLink to="/dashboard" isOpen={isOpen} iconLetter="D" label="Dashboard" />
            <SidebarLink to="/my-profile" isOpen={isOpen} iconLetter="M" label="My Profile" />
            <SidebarLink to="/all-employees" isOpen={isOpen} iconLetter="A" label="All Employees" />
            <SidebarLink to="/leaves" isOpen={isOpen} iconLetter="L" label="Leave Requests" />
            <SidebarLink to="/attendence" isOpen={isOpen} iconLetter="A" label="Attendance" />
             <SidebarLink to="/admin/login-logs" isOpen={isOpen} iconLetter="L" label="Login Logs" />
              <SidebarLink to="/employee/my-payroll" isOpen={isOpen} iconLetter="P" label="Pay Roll" />
            <SidebarLink to="/chat" isOpen={isOpen} iconLetter="C" label="Chat" badge={totalUnread} />
          </>
        )}
        {role === "employee" && (
          <>
            <SidebarLink to="/employee/dashboard" isOpen={isOpen} iconLetter="D" label="Dashboard" />
            <SidebarLink to="/my-profile" isOpen={isOpen} iconLetter="M" label="My Profile" />
            <SidebarLink to="/employee/my-payroll" isOpen={isOpen} iconLetter="P" label="Pay Roll" />
            <SidebarLink to="/employee/leave" isOpen={isOpen} iconLetter="M" label="My Leaves" />
            <SidebarLink to="/employee/my-tasks" isOpen={isOpen} iconLetter="M" label="My Tasks" />
            <SidebarLink to="/employee/login-logs" isOpen={isOpen} iconLetter="L" label="Login Activity" />
            <SidebarLink to="/chat" isOpen={isOpen} iconLetter="C" label="Chat" badge={totalUnread} />
          </>
        )}
         {role === "project_coordinator" && (
          <>
            <SidebarLink to="/employee/dashboard" isOpen={isOpen} iconLetter="D" label="Dashboard" />
            <SidebarLink to="/my-profile" isOpen={isOpen} iconLetter="M" label="My Profile" />
            <SidebarLink to="/employee/my-payroll" isOpen={isOpen} iconLetter="P" label="Pay Roll" />
            <SidebarLink to="/admin/assign-task" isOpen={isOpen} iconLetter="T" label="Tasks" />
            <SidebarLink to="/employee/leave" isOpen={isOpen} iconLetter="M" label="My Leaves" />
            <SidebarLink to="/employee/my-tasks" isOpen={isOpen} iconLetter="M" label="My Tasks" />
            <SidebarLink to="/employee/login-logs" isOpen={isOpen} iconLetter="L" label="Login Activity" />
            <SidebarLink to="/chat" isOpen={isOpen} iconLetter="C" label="Chat" badge={totalUnread} />
          </>
        )}
      </nav>
    </div>
  );
};

const SidebarLink = ({ to, iconLetter, label, isOpen, badge = 0 }) => (
  <Link
    to={to}
    className="px-4 py-3 rounded-lg hover:bg-gray-700 flex items-center gap-3 whitespace-nowrap text-sm sm:text-base transition-colors"
  >
    <span className="text-lg font-bold">{iconLetter}</span>
    <span className={`${!isOpen && "hidden"} transition-all duration-300`}>{label}</span>
    {badge > 0 && isOpen && (
      <span className="ml-2 bg-red-500 text-white text-xs sm:text-sm font-bold rounded-full px-2 py-0.5">
        {badge > 99 ? "99+" : badge}
      </span>
    )}
  </Link>
);

export default Sidebar;
