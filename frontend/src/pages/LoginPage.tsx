import { useState } from "react";
import { auth, providers } from "../firebaseConfig";
import {
  signInWithPopup,
  fetchSignInMethodsForEmail,
  linkWithPopup,
} from "firebase/auth";
import axios from "axios";

import {
  GoogleOutlined,
  FacebookFilled,
  GithubOutlined,
} from "@ant-design/icons";
import { message } from "antd";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async (providerName: string) => {
    const provider = providers[providerName];
    if (!provider) return;

    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Firebase User object:", result.user);

      const token = await result.user.getIdToken();
      console.log("Firebase ID Token:", token);

      const res = await axios.get(`${socketUrl}/api/auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Backend full response:", res);

      const signInProvider = res.data.user.firebase?.sign_in_provider;

      if (signInProvider === "github.com") {
        messageApi.success(`Xin chào ${res.data.user.email || res.data.user.name}!`);
      } else {
        messageApi.success(`Xin chào ${res.data.user.name || res.data.user.email}!`);
      }

    } catch (err: any) {
      console.error("Firebase login error:", err);

      if (err.code === "auth/account-exists-with-different-credential") {
        const email = err.email;
        if (!email) {
          messageApi.error("Không thể xác định email để liên kết.");
          return;
        }

        const methods = await fetchSignInMethodsForEmail(auth, email);
        const oldProviderName = methods[0].split(".")[0];
        const oldProvider = providers[oldProviderName];

        if (!oldProvider) {
          messageApi.warning("Provider cũ chưa được cấu hình!");
          return;
        }

        messageApi.info(
          `Email này đã tồn tại với ${methods[0]}. Đang đăng nhập bằng provider cũ...`
        );

        const oldUserResult = await signInWithPopup(auth, oldProvider);
        await linkWithPopup(oldUserResult.user, provider);

        const token = await oldUserResult.user.getIdToken();
        const res = await axios.get(`${socketUrl}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        messageApi.success(
          `Liên kết thành công! Xin chào ${res.data.user.email}`
        );
      } else {
        messageApi.error("Đăng nhập thất bại, vui lòng kiểm tra lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}

      <div className="mt-10 flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8">
          <div className="mb-6 text-center">
            <p className="font-bold text-2xl">Đăng nhập</p>
            <p className="text-gray-500">Vui lòng nhập email và mật khẩu</p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none "
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none "
            />
            <button
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded-lg disabled:opacity-50"
            >
              Đăng nhập
            </button>
          </div>

          <div className="flex items-center gap-2 my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-400 text-sm">Hoặc</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleLogin("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 px-4 py-3 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <GoogleOutlined style={{ fontSize: 20, color: "#DB4437" }} />
              <span>Đăng nhập với Google</span>
            </button>

            <button
              onClick={() => handleLogin("facebook")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 px-4 py-3 rounded-lg hover:bg-gray-50 text-blue-600 disabled:opacity-50"
            >
              <FacebookFilled style={{ fontSize: 20, color: "#1877F2" }} />
              <span>Đăng nhập với Facebook</span>
            </button>

            <button
              onClick={() => handleLogin("github")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-800 disabled:opacity-50"
            >
              <GithubOutlined style={{ fontSize: 20 }} />
              <span>Đăng nhập với GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
