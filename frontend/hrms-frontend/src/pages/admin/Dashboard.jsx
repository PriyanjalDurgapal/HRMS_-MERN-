import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../services/dashboardApi";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);
  //  useEffect(() => {
  //     if (user?.role === "admin"||user?.role === "hr") loadTasks();
  //   }, []);

  const loadDashboard = async () => {
    try {
      const res = await fetchDashboardStats();
      setStats(res.data.data);
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <StatCard title="Total Employees" value={stats.totalEmployees} color="from-indigo-500 to-indigo-600" />
      <StatCard title="Present Today" value={stats.presentToday} color="from-green-500 to-green-600" />
      <StatCard title="Absent Today" value={stats.absentToday} color="from-red-500 to-red-600" />
      <StatCard title="Pending Leaves" value={stats.pendingLeaves} color="from-yellow-500 to-yellow-600" />
      <StatCard title="Active Tasks" value={stats.activeTasks} color="from-purple-500 to-purple-600" />
    </div>
  );
}

function StatCard({ title, value, color = "from-gray-500 to-gray-600" }) {
  return (
    <div className={`bg-gradient-to-r ${color} text-white rounded-2xl p-4 sm:p-6 shadow-lg transform transition-transform duration-200 hover:scale-105`}>
      <p className="text-xs sm:text-sm opacity-80">{title}</p>
      <h2 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{value}</h2>
    </div>
  );
}
