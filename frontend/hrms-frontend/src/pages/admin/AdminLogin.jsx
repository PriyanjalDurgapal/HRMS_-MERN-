import { useState } from "react";
import Slider from "../../components/Slider";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { adminLogin } from "../../api/authApi";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const slides = [
    {
      image: "/stars.jpg",
      title: "Capturing Moments,",
      subtitle: "Creating Memories",
    },
    {
      image: "/stars.jpg",
      title: "Welcome Back",
      subtitle: "Let’s continue your journey",
    },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await adminLogin({ email, password, role: "admin" });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem(
          "userId",
          response.data.id || response.data.employee?._id || response.data._id
        );

        window.location.href = "/dashboard";
      }
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-6">
      <div className="w-full max-w-6xl bg-[#3F355C] rounded-3xl shadow-[0_0_25px_rgba(0,0,0,0.6)] p-2">
        <div className="flex flex-col md:flex-row bg-[#2c2638] rounded-2xl overflow-hidden shadow-2xl">

          <div className="w-full md:w-1/2 h-[220px] sm:h-[280px] md:h-[90vh]">
            <Slider slides={slides} />
          </div>

          <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-14 text-white flex items-center justify-center">
            <div className="w-full max-w-md bg-[#5A4A80] p-8 sm:p-10 rounded-xl shadow-xl shadow-black/40 animate-[fadeSlideUp_0.7s_ease-out]">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                Admin Login
              </h1>

              <p className="mb-6 text-xs sm:text-sm opacity-80">
                Please sign in to continue.
              </p>

              {error && (
                <p className="text-red-400 text-xs sm:text-sm mb-4">
                  {error}
                </p>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <Input
                  placeholder="Admin Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-purple-400"
                      checked={remember}
                      onChange={() => setRemember(!remember)}
                    />
                    Remember me
                  </label>
                  <span className="underline cursor-pointer">
                    Forgot Password?
                  </span>
                </div>

                <Button
                  text={loading ? "Logging in..." : "Login"}
                  loading={loading}
                />
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}