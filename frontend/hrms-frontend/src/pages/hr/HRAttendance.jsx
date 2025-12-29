import { useEffect, useState } from "react";
import { hrAttendance } from "../../services/attendance";

const HRAttendance = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    hrAttendance().then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <h2>HR Attendance Panel</h2>
      {data.map((a) => (
        <div key={a._id}>
          {a.employee.name} | {a.date} | {a.status}
        </div>
      ))}
    </div>
  );
};

export default HRAttendance;
