import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithUsername, loginWithGoogle, registerUser } from "../services/auth.service";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) return alert("Nhập username và password");
    setLoading(true);
    try {
      const res = await loginWithUsername(formData.username, formData.password);
      alert(res.message);
    } catch {
      alert("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.username || !formData.password) return alert("Nhập username và password");
    setLoading(true);
    try {
      const res = await registerUser(formData.username, formData.email, formData.password);
      alert(res.message);
    } catch {
      alert("Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

const handleGoogle = async (credentialResponse: any) => {
  if (!credentialResponse?.credential) {
    return alert("Google credential không tồn tại");
  }
  setLoading(true);
  try {
    const res = await loginWithGoogle(credentialResponse.credential);
    console.log("Google login response:", res); // debug
    alert(res.message);
  } catch {
    alert("Đăng nhập Google thất bại");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex w-[600px] mx-auto rounded-lg justify-center mt-20">
      <div className="w-full p-6 bg-white rounded-lg">
        <div className="flex justify-center mb-4 space-x-4">
          <button
            className={`px-4 py-2 rounded ${tab === "login" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded ${tab === "register" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTab("register")}
          >
            Register
          </button>
        </div>

        {tab === "login" && (
          <div className="space-y-4">
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full border border-gray-200 p-2 rounded"
              disabled={loading}
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border border-gray-200  p-2 rounded"
              disabled={loading}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Login"}
            </button>
            <div className="flex justify-center mt-2">
              <GoogleLogin onSuccess={handleGoogle} onError={() => alert("Google login failed")} />
            </div>
          </div>
        )}

        {tab === "register" && (
          <div className="space-y-4">
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full border border-gray-200  p-2 rounded"
              disabled={loading}
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border border-gray-200  p-2 rounded"
              disabled={loading}
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border border-gray-200  p-2 rounded"
              disabled={loading}
            />
            <button
              onClick={handleRegister}
              className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Register"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
