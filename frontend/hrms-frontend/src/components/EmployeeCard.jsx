import React from "react";

const EmployeeCard = ({ employee, onOpen, onDelete }) => {

  const defaultProfilePic = "https://ui-avatars.com/api/?name=" + encodeURIComponent(employee.name || "User") + "&background=random";

  const isFormer = employee.isFormer || false;

  // Safe profile pic URL handling
  const profileSrc = employee.profilePic
    ? `http://localhost:5000${employee.profilePic.startsWith("/") ? "" : "/"}${employee.profilePic.replace(/\\/g, "/")}`
    : defaultProfilePic;

  return (
    <div
      className={`
        relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl 
        transition-all duration-300 transform hover:-translate-y-1
        border border-gray-200
        ${isFormer ? "opacity-80 bg-gray-50" : ""}
      `}
    >
    
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isFormer ? "bg-red-500" : "bg-blue-600"
        }`}
      ></div>

      <div className="p-6 flex items-start gap-6">
        
        <div className="flex-shrink-0">
          <img
            src={profileSrc}
            alt={`${employee.name}'s profile`}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            onError={(e) => {
              e.target.src = defaultProfilePic; 
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 cursor-pointer" onClick={() => onOpen(employee)}>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {employee.name || "Unknown Employee"}
          </h3>

          <p className="text-sm text-gray-600 mb-3">{employee.email}</p>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {employee.role || "No Role"}
            </span>
            {employee.department && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                {employee.department}
              </span>
            )}
            {isFormer && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                Former Employee
              </span>
            )}
          </div>
        </div>
      </div>

      
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm">
        <div className="text-gray-500">
          ID: <span className="font-medium text-gray-700">
            {employee._id.slice(-6).toUpperCase()}
          </span>
          {isFormer && (
            <span className="ml-3 text-red-600">
              Deleted: {new Date(employee.deletedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-xs italic">Tap to view details</span>

          {!isFormer && (
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                onDelete();
              }}
              className="
                bg-red-600 hover:bg-red-700 text-white 
                px-4 py-2 rounded-lg text-sm font-medium 
                transition-colors duration-200 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
              "
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;