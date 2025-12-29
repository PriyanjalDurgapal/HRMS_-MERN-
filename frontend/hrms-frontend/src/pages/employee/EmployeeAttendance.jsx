import { useState } from "react";
import { markAttendance } from "../../services/attendance";

const EmployeeAttendance = () => {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    try {
      const res = await markAttendance({ code });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div>
      <h2>Mark Attendance</h2>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter secret code"
      />
      <button onClick={submit}>Submit</button>
      <p>{msg}</p>
    </div>
  );
};

export default EmployeeAttendance;
