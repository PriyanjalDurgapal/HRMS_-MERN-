import { useEffect, useState } from "react";
import {
  adminAllLeaves,
  adminUpdateLeave,
} from "../../services/leave";

const AdminLeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ALL LEAVES ================= */
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await adminAllLeaves();
      setLeaves(res.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
      setError("Unauthorized or session expired. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE LEAVE STATUS ================= */
  const updateStatus = async (leaveId, status) => {
    try {
      await adminUpdateLeave(leaveId, { status });
      fetchLeaves();
    } catch (err) {
      console.error("Failed to update leave:", err);
      alert("Action failed. Please try again.");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* ================= UI STATES ================= */
  if (loading) return <p style={{ padding: 20 }}>Loading leaves...</p>;

  if (error)
    return (
      <p style={{ padding: 20, color: "red" }}>
        {error}
      </p>
    );

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Leave Approval</h2>

      {leaves.length === 0 && (
        <p>No leave requests found.</p>
      )}

      {leaves.map((l) => (
        <div
          key={l._id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 12,
            borderRadius: 6,
          }}
        >
          <p><b>Name:</b> {l.employee?.name}</p>
          <p><b>Employee ID:</b> {l.employee?.employeeId}</p>
          <p><b>Department:</b> {l.employee?.department}</p>
          <p><b>Leave Type:</b> {l.leaveType}</p>
          <p>
            <b>Duration:</b>{" "}
            {new Date(l.startDate).toLocaleDateString()} →{" "}
            {new Date(l.endDate).toLocaleDateString()}
          </p>
          <p><b>Status:</b> {l.status}</p>

          {l.status === "Pending" && (
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => updateStatus(l._id, "Approved")}
                style={{
                  marginRight: 10,
                  background: "green",
                  color: "#fff",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(l._id, "Rejected")}
                style={{
                  background: "red",
                  color: "#fff",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Reject
              </button>
            </div>
          )}

          {l.managerComment && (
            <p style={{ marginTop: 6 }}>
              <b>Comment:</b> {l.managerComment}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminLeaveApproval;
