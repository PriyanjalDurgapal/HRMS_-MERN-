import api from "../api/axios";

export const fetchMyProfile = () =>
  api.get("/profile/me");

export const updateProfileField = (data) =>
  api.put("/profile/me", data);