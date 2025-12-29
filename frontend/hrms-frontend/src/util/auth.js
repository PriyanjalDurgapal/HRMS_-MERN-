// src/util/auth.js

/* =========================
   TOKEN
========================= */

export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const setToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const removeToken = () => {
  localStorage.removeItem("authToken");
};

/* =========================
   USER (FIXED)
========================= */

export const getUser = () => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  if (!name || !role) return null;

  return { name, role };
};

export const setUser = (user) => {
  // supports both full object or individual values
  if (user?.name) localStorage.setItem("name", user.name);
  if (user?.role) localStorage.setItem("role", user.role);
};

export const removeUser = () => {
  localStorage.removeItem("name");
  localStorage.removeItem("role");
};

/* =========================
   AUTH CHECK
========================= */

export const isAuthenticated = () => {
  return !!getToken();
};
