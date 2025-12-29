import React from "react";

const FilterSelect = ({ value, onChange }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          appearance-none
          w-44
          px-4
          py-2.5
          pr-10
          text-sm
          bg-white
          border
          border-gray-300
          rounded-lg
          shadow-sm
          cursor-pointer
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          hover:border-gray-400
          transition
        "
      >
        <option value="">All Roles</option>
        <option value="employee">Employee</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>

      {/* custom arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default FilterSelect;
