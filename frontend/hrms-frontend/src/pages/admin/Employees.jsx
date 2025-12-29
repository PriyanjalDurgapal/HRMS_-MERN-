import React, { useEffect, useState } from "react";
import axios from "axios";

import EmployeeCard from "../../components/EmployeeCard";
import EmployeeModal from "../../components/EmployeeModal";
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [formerEmployees, setFormerEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const token = localStorage.getItem("authToken");

  // Fetch current employees
  const loadEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      const valid = data.filter(emp => emp && emp._id && typeof emp.name === 'string');
      setEmployees(valid);
    } catch (err) {
      console.error("Error loading employees:", err);
    }
  };

const loadFormerEmployees = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/employees/former", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = Array.isArray(res.data) ? res.data : [];
    console.log("Former employees raw:", data);

   
    const transformed = data.map((item) => {
      
      if (!item || !item.employeeSnapshot) return null;

      const snapshot = item.employeeSnapshot;

      return {
        _id: item._id,  
        originalEmployeeId: item.originalEmployeeId,
        name: snapshot.name || "Unknown",  
        email: snapshot.email || "",
        role: snapshot.role || "",
        
        position: snapshot.position || "",
        department: snapshot.department || "",
        
        deletedAt: item.deletedAt,
        deletedBy: item.deletedBy,
        isFormer: true,  
      };
    }).filter(Boolean); 

    setFormerEmployees(transformed);
  } catch (err) {
    console.error("Error loading former employees:", err);
  }
}; 
  useEffect(() => {
    if (token) {
      loadEmployees();
      loadFormerEmployees();
    }
  }, [token]);

  // Delete employee with OTP
  const handleDelete = async (id) => {
    try {
     
      await axios.post(
        `http://localhost:5000/api/employees/send-delete-otp/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const otp = prompt("Enter OTP sent to admin email for deletion:");
      if (!otp) return;

      
      await axios.post(
        `http://localhost:5000/api/employees/verify-delete/${id}`,
        { otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Employee deleted successfully");
      loadEmployees();
      loadFormerEmployees();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete employee");
    }
  };

  // Safe filtering
  const filteredEmployees = employees.filter((emp) => {
    if (!emp || typeof emp.name !== 'string') return false;
    return (
      emp.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterRole ? emp.role === filterRole : true)
    );
  });

  const filteredFormer = formerEmployees.filter((emp) => {
    if (!emp || typeof emp.name !== 'string') return false;
    return (
      emp.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterRole ? emp.role === filterRole : true)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>

      <div className="flex gap-3 mb-5">
        <SearchBar value={search} onChange={setSearch} />
        <FilterSelect value={filterRole} onChange={setFilterRole} />
      </div>

      {/* Current Employees */}
      <h2 className="text-xl font-semibold mt-5 mb-3">Current Employees</h2>
      <div className="grid gap-4">
        {filteredEmployees.map((employee) => (
          <EmployeeCard
            key={employee._id}
            employee={employee}
            onOpen={(emp) => {
              setSelectedEmployee(emp);
              setModalOpen(true);
            }}
            onDelete={() => handleDelete(employee._id)}
          />
        ))}
        {filteredEmployees.length === 0 && (
          <p className="text-gray-500">
            {search || filterRole ? "No matching current employees." : "No current employees found."}
          </p>
        )}
      </div>

      {/* Former Employees */}
      <h2 className="text-xl font-semibold mt-10 mb-3">Former Employees</h2>
      <div className="grid gap-4">
        {filteredFormer.map((employee) => (
          <EmployeeCard
            key={employee._id}
            employee={employee}
            onOpen={(emp) => {
              setSelectedEmployee(emp);
              setModalOpen(true);
            }}
            onDelete={() => handleDelete(employee._id)} // Note: deletion might be disabled for former employees
          />
        ))}
        {filteredFormer.length === 0 && (
          <p className="text-gray-500">
            {search || filterRole ? "No matching former employees." : "No former employees found."}
          </p>
        )}
      </div>

      <EmployeeModal
        open={modalOpen}
        employee={selectedEmployee}
        onClose={() => setModalOpen(false)}
        onUpdate={() => {
          loadEmployees();
          loadFormerEmployees();
        }}
      />
    </div>
  );
};

export default Employees;