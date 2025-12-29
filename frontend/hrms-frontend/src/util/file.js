// src/utils/file.js
export const getFileUrl = (filePath) => {
  if (!filePath) return null;
  return `http://localhost:5000/${filePath.replace(/\\/g, "/").replace(/^\/?/, "")}`;
};
