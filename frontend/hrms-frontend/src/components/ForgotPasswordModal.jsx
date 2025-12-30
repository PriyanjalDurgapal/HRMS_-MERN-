import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { sendResetOtp, resetPassword } from "../api/passwordResetApi";

export default function ForgotPasswordModal({ open, onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  const sendOtp = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await sendResetOtp({ email });
      setStep(2);
      setSuccess("OTP sent to your registered email");
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (!otp || !newPassword) {
      setError("All fields are required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await resetPassword({ email, otp, newPassword });
      setSuccess("Password updated successfully");
      setTimeout(onClose, 1800);
    } catch {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-[#5A4A80] to-[#3F355C] p-8 shadow-2xl relative text-white animate-[fadeSlideUp_0.4s_ease-out]">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-center mb-2">
          Reset Your Password
        </h2>

        <p className="text-center text-sm opacity-80 mb-6">
          {step === 1
            ? "Enter your registered email to receive an OTP"
            : "Enter the OTP and set a new password"}
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-400/30 px-4 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-500/10 border border-green-400/30 px-4 py-2 text-sm text-green-300">
            {success}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Input
              placeholder="Registered Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              text={loading ? "Sending OTP..." : "Send OTP"}
              loading={loading}
              onClick={sendOtp}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Input
              placeholder="One Time Password"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Input
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              text={loading ? "Updating Password..." : "Change Password"}
              loading={loading}
              onClick={changePassword}
            />
          </div>
        )}
      </div>
    </div>
  );
}
