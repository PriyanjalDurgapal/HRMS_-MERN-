// src/utils/file.js
export const getFileUrl = (filePath) => {
  if (!filePath) return null;

  const baseUrl = import.meta.env.VITE_API_URL;

  return `${baseUrl}/${filePath
    .replace(/\\/g, "/")
    .replace(/^\/?/, "")}`;
};