// src/components/MyPayroll.js
import { useEffect, useState } from "react";
import { fetchMyPayroll } from "../../services/payrollApi";

export default function MyPayroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await fetchMyPayroll();
        setPayrolls(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-4 md:p-10 bg-gray-50 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-800">My Payroll</h2>

      {loading && <p className="text-gray-600">Loading payroll records...</p>}
      {!loading && payrolls.length === 0 && <p className="text-gray-600">No payroll records found.</p>}

      {payrolls.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-gray-700 text-sm sm:text-base font-medium">Month</th>
                <th className="px-4 sm:px-6 py-3 text-left text-gray-700 text-sm sm:text-base font-medium">Year</th>
                <th className="px-4 sm:px-6 py-3 text-left text-gray-700 text-sm sm:text-base font-medium">Net Salary</th>
                <th className="px-4 sm:px-6 py-3 text-left text-gray-700 text-sm sm:text-base font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrolls.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 sm:px-6 py-4 text-sm sm:text-base">{p.month}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm sm:text-base">{p.year}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm sm:text-base font-semibold">₹{p.netSalary.toLocaleString()}</td>
                  <td className={`px-4 sm:px-6 py-4 text-sm sm:text-base font-bold ${p.status === "Paid" ? "text-green-600" : "text-red-600"}`}>
                    {p.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
