import axios from "axios";

export interface User {
  username?: string;
  email?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

const api = axios.create({
  baseURL: import.meta.env.VITE_SOCKET_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginWithUsername = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const { data } = await api.post("/api/auth/login", { username, password });

    if (data.success && data.data) {
      localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.data.user)); 
      localStorage.setItem("refreshToken", data.data.refreshToken);
    }

    return data;
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Đăng nhập thất bại." };
  }
};

export const loginWithGoogle = async (credential: string): Promise<LoginResponse> => {
  try {
    const { data } = await api.post("/api/auth/google", { credential });

    if (data.success && data.data) {
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.data.user));

    }

    return data;
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Đăng nhập Google thất bại." };
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
    localStorage.removeItem("user"); 

};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const isLoggedIn = () => !!getAccessToken();

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    const { data } = await api.post("/api/auth/register", { username, email, password });

    if (data.success && data.data) {
      localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.data.user)); 
      localStorage.setItem("refreshToken", data.data.refreshToken);
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Đăng ký thất bại.",
    };
  }
};
export const getUser = (): User | null => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};