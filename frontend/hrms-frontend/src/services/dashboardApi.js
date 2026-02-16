import api from "../api/axios";


export const fetchDashboardStats = () =>
  api.get("hr/dashboard-stats");
