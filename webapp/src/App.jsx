import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import APIs, { authApis, endpoints } from "../configs/Apis";
import Cookies from "js-cookie";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(Cookies.get("token") || null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  // Kiểm tra token khi load app
  useEffect(() => {
    if (!token || !user) return;
    const fetchProfile = async () => {
      try {
        const api = authApis();
        const res = await api.get(endpoints.profile);
        setUser(res.data);
      } catch (err) {
        console.error("ERR", err.response?.data || err.message);
        logout();

      }
    };

    fetchProfile();
  }, [token]);

  const login = async (credentials) => {
    const response = await APIs.post(endpoints.login, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    setToken(response.data.token);
    Cookies.set('token', response.data.token, { expires: 1 });
    const api = authApis(); // gắn token
    const profileRes = await api.get(endpoints.profile);
    localStorage.setItem("user", JSON.stringify(profileRes.data));
    setUser(profileRes.data); // cập nhật user
    navigate("/");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("user");
    Cookies.remove("token");
    // navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);