import React from "react";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
     
      <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M21 21l-4.35-4.35" />
          <circle cx="11" cy="11" r="7" />
        </svg>
      </div>

      <input
        type="text"
        placeholder="Search employee..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          pl-11
          pr-4
          py-2.5
          text-sm
          bg-white
          border
          border-gray-300
          rounded-lg
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          hover:border-gray-400
          transition
        "
      />
    </div>
  );
};

export default SearchBar;
