import { useEffect, useRef, useState } from "react";
import { FiClock, FiAlertTriangle, FiPauseCircle } from "react-icons/fi";

const TaskTimer = ({ task }) => {
  const deadline = task?.dueDate || task?.deadline;
  const status = task?.status;

  const intervalRef = useRef(null);
  const pausedAtRef = useRef(null);
  const adjustedDeadlineRef = useRef(null);
  const initialDurationRef = useRef(null);

  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [remainingPercent, setRemainingPercent] = useState(100);

  const startTimer = () => {
    if (!adjustedDeadlineRef.current) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const end = adjustedDeadlineRef.current;

    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, end - now);

      if (!initialDurationRef.current) {
        initialDurationRef.current = remaining;
      }

      const percent = Math.max(
        0,
        Math.round((remaining / initialDurationRef.current) * 100)
      );
      setRemainingPercent(percent);

      const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const h = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const m = Math.floor((remaining / (1000 * 60)) % 60);
      const s = Math.floor((remaining / 1000) % 60);

      setTime({ d, h, m, s });
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
  };


  useEffect(() => {
    if (!deadline) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    pausedAtRef.current = null;
    initialDurationRef.current = null;

    adjustedDeadlineRef.current = new Date(deadline).getTime();
    startTimer();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [task?._id, deadline]);

  
  useEffect(() => {
    if (!deadline) return;

   
    if (status === "Paused") {
      if (!pausedAtRef.current) {
        pausedAtRef.current = Date.now();
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    //  RESUME
    if (pausedAtRef.current) {
      const pauseDuration = Date.now() - pausedAtRef.current;
      adjustedDeadlineRef.current += pauseDuration;
      pausedAtRef.current = null;
      startTimer();
    }
  }, [status]);

  /* Color logic */
  const getColor = () => {
    if (remainingPercent > 50) return "blue";
    if (remainingPercent > 30) return "orange";
    return "red";
  };

  const color = getColor();
  const isCritical = remainingPercent <= 30;

  return (
    <div
      className={`fixed top-24 right-6 z-50
      bg-black/80 backdrop-blur-xl
      rounded-2xl p-4 w-80
      border border-white/10
      shadow-2xl shadow-${color}-500/30
      transition-all duration-700`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 text-white mb-3">
        <FiClock className={`text-2xl text-${color}-400`} />

        <div className="flex-1">
          <p className="text-xs uppercase text-gray-400">Time Left</p>
          <p className="font-semibold truncate">{task.title}</p>
        </div>

        {status === "Paused" ? (
          <FiPauseCircle className="text-yellow-400 text-2xl" />
        ) : (
          isCritical && <FiAlertTriangle className="text-red-500 animate-pulse" />
        )}
      </div>

      {/*  Reverse Digital Clock */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <TimeBox label="DD" value={time.d} color={color} />
        <TimeBox label="HH" value={time.h} color={color} />
        <TimeBox label="MM" value={time.m} color={color} />
        <TimeBox label="SS" value={time.s} color={color} />
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full bg-${color}-500 transition-all duration-1000`}
          style={{ width: `${remainingPercent}%` }}
        />
      </div>

      {/* Status */}
      {status === "Paused" && (
        <p className="text-center text-yellow-400 text-xs mt-3 font-semibold">
          ⏸ Task Paused — Timer stopped
        </p>
      )}

      <p className="text-[11px] text-gray-500 mt-2">
        Deadline: {new Date(deadline).toLocaleString()}
      </p>
    </div>
  );
};

/* Time Box */
const TimeBox = ({ label, value, color }) => (
  <div
    className={`rounded-xl py-3
    bg-white/5 border border-white/10
    shadow-inner shadow-${color}-500/20`}
  >
    <p className={`text-2xl font-mono font-bold text-${color}-400`}>
      {String(value).padStart(2, "0")}
    </p>
    <p className="text-[10px] text-gray-400 mt-1">{label}</p>
  </div>
);

export default TaskTimer;
