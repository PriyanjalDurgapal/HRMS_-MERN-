import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import { UnreadProvider } from "./context/UnreadContext";
import AddEmployee from "./pages/admin/AddEmployee";
import Employees from "./pages/admin/Employees";
import EmployeeLogin from "./pages/employee/Employeelogin";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import Logout from "./components/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import LeavePage from "./pages/employee/EmployeeLeavePage";
import AdminLeaveApproval from "./pages/admin/AdminLeaveApproval";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AssignTask from "./pages/admin/AssignTask";
import MyTasks from "./pages/employee/MyTasks";
import MyProfile from "./pages/employee/MyProfile";
import MyPayroll from "./pages/employee/MyPayroll";
import AdminPayroll from "./pages/admin/AdminPayroll";
import ChatPage from "./chat/ChatPage";
import AdminLoginLogs from "./pages/admin/AdminLoginLogs";

import MyLoginLogs from "./pages/employee/MyLoginLogs";


//  Socket context
import { SocketProvider } from "./context/SocketContext";
import SelectLogin from "./components/SelectLogin";

export default function App() {
  const userName = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  return (
    <SocketProvider>
      <UnreadProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/employee-login" element={<EmployeeLogin />} />
            <Route path="/" element={<SelectLogin />} />

            {/* Admin Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRole={["admin","hr"]}>
                  <AdminLayout userName={userName} role={role}>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/login-logs"
              element={
                <ProtectedRoute allowedRole={["admin","hr"]}>
                  <AdminLayout userName={userName} role={role}>
                    <AdminLoginLogs />

                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/assign-task"
              element={
                <ProtectedRoute allowedRole={["admin","project_coordinator"]}>
                  <AdminLayout userName={userName} role={role}>
                    <AssignTask />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-employee"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminLayout userName={userName} role={role}>
                    <AddEmployee />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-employees"
              element={
                <ProtectedRoute allowedRole={["admin","hr"]}>
                  <AdminLayout userName={userName} role={role}>
                    <Employees />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves"
              element={
                <ProtectedRoute allowedRole={["admin","hr"]}>
                  <AdminLayout userName={userName} role={role}>
                    <AdminLeaveApproval />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/payroll"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminLayout userName={userName} role={role}>
                    <AdminPayroll />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/attendence"
              element={
                <ProtectedRoute allowedRole={["admin","hr"]}>
                  <AdminLayout userName={userName} role={role}>
                    <AdminAttendance />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Employee Protected Routes */}
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute allowedRole={["employee","project_coordinator"]}>
                  <AdminLayout userName={userName} role={role}>
                    <EmployeeDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute allowedRole={["employee","hr","project_coordinator"]}>
                  <AdminLayout userName={userName} role={role}>
                    <MyProfile />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/my-payroll"
              element={
                <ProtectedRoute allowedRole={["employee","hr","project_coordinator"]}>
                  <AdminLayout userName={userName} role={role}>
                    <MyPayroll />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/login-logs"
              element={
                <ProtectedRoute allowedRole={["employee","project_coordinator"]}>
                  <AdminLayout userName={userName} role={role}>
                    <MyLoginLogs />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/employee/my-tasks"
              element={
                <ProtectedRoute allowedRole={["employee","project_coordinator"]}>
                  <AdminLayout userName={userName} role={role}>
                    <MyTasks />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/leave"
              element={
                <ProtectedRoute allowedRole={["employee","project_coordinator"]}>
                  <AdminLayout userName={userName} role={role}>
                    <LeavePage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Chat Feature */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute allowedRole={role}>
                  <AdminLayout userName={userName} role={role}>
                    <ChatPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Logout */}
            <Route path="/logout" element={<Logout />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </UnreadProvider>
    </SocketProvider>
  );
}