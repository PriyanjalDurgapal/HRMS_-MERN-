import { useState } from "react";
import {
  sendChangePasswordOTP,
  verifyOTPAndChangePassword,
} from "../api/changePasswordApi";

const ChangePasswordModal = ({ onClose }) => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const sendOTP = async () => {
    if (!email.trim()) {
      return showMessage("Please enter your registered email");
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return showMessage("Please enter a valid email address");
    }

    try {
      setLoading(true);
      showMessage("");
      const res = await sendChangePasswordOTP(email.trim());

      showMessage(res.data.message, "success");
      setStep(2);

      
      setTimeout(() => {
        document.getElementById("otp-input")?.focus();
      }, 100);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to send OTP. Please try again later.";
      showMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (!otp.trim()) return showMessage("Please enter the OTP");
    if (otp.length !== 6) return showMessage("OTP must be 6 digits");
    if (!newPassword) return showMessage("Please enter a new password");
    if (newPassword.length < 6)
      return showMessage("Password must be at least 6 characters");

    try {
      setLoading(true);
      showMessage("");

      await verifyOTPAndChangePassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      showMessage("Password changed successfully!", "success");

     
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to change password. Please try again.";
      showMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, nextAction) => {
    if (e.key === "Enter" && !loading) {
      nextAction();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md transform animate-scaleIn rounded-xl bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="mb-5 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Change Password
          </h2>
          <p className="text-sm text-gray-500">
            Verify your identity with OTP sent to email
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 text-center text-sm font-medium transition-all ${
              messageType === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Registered Email
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, sendOTP)}
              disabled={loading}
              className="mb-5 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
              autoFocus
            />

            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2: OTP + New Password */}
        {step === 2 && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              6-Digit OTP
            </label>
            <input
              id="otp-input"
              type="text"
              maxLength="6"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only numbers
              onKeyPress={(e) => handleKeyPress(e, changePassword)}
              disabled={loading}
              className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg font-semibold tracking-wider outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
            />

            <label className="mb-1 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter strong password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, changePassword)}
              disabled={loading}
              className="mb-5 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
            />

            <button
              onClick={changePassword}
              disabled={loading}
              className="w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating Password..." : "Change Password"}
            </button>
          </div>
        )}

        
        <button
          onClick={onClose}
          disabled={loading}
          className="mt-5 block w-full text-center text-sm text-gray-500 transition hover:text-gray-700 hover:underline"
        >
          Cancel
        </button>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChangePasswordModal;