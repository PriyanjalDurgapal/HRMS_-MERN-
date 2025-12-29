// src/components/TaskCard.jsx
import { FiUpload, FiStopCircle, FiCalendar } from "react-icons/fi";

const TaskCard = ({ task, onUploadReport, onRequestStop }) => {
  const deadline = task.deadline || task.dueDate;

  return (
    <div className="bg-[#0b1220] rounded-2xl p-6 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 transition">
      <h3 className="text-lg font-bold mb-1">{task.title}</h3>
      <p className="text-gray-400 text-sm mb-4">{task.description}</p>

      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <FiCalendar />
        <span>
          Deadline: {deadline ? new Date(deadline).toLocaleDateString() : "N/A"}
        </span>
      </div>

      <span className="inline-block px-4 py-1.5 text-sm rounded-full bg-white/10 mb-4">
        {task.status}
      </span>

      <div className="flex gap-3 mt-4">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-400">
          <FiUpload />
          Upload
          <input
            type="file"
            hidden
            onChange={e => onUploadReport(task._id, e.target.files[0])}
          />
        </label>

        <button
          onClick={() => onRequestStop(task._id)}
          className="flex items-center gap-2 text-sm text-red-400"
        >
          <FiStopCircle />
          Stop
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
