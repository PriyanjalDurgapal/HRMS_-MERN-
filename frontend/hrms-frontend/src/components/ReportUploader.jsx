// src/components/ReportUploader.jsx
import { useState } from "react";

const ReportUploader = ({ taskId, onUpload, disabled = false }) => {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    onUpload(taskId, file);
    setFile(null);
  };

  return (
    <div className="border-t pt-6 mt-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Upload Completion Report
      </label>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={disabled}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
        />
        <button
          onClick={handleUpload}
          disabled={!file || disabled}
          className={`px-8 py-3 rounded-lg font-bold transition shadow-md ${
            file && !disabled
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Upload Report
        </button>
      </div>
      {file && <p className="text-sm text-gray-600 mt-2">Selected: {file.name}</p>}
    </div>
  );
};

export default ReportUploader;