// src/components/HistoryTaskCard.jsx
const HistoryTaskCard = ({ task }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
      <h4 className="font-bold text-lg text-gray-700 mb-2">{task.title}</h4>
      <p className="text-gray-600 text-sm mb-4">{task.description}</p>
      <div className="text-xs text-gray-500 space-y-1">
        <p>Assigned by: {task.assignedBy?.name} ({task.assignedByRole})</p>
        <p>Importance: {task.importance} • Status: <strong>{task.status}</strong></p>
        <p>Completed on: {new Date(task.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default HistoryTaskCard;