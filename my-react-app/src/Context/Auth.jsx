import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../Pages/Axios/AxiosInterciptor";

export const AutContext = createContext();

export const Authprovider = ({ children }) => {
  const [User, setUser] = useState(() => {
    try {
      const loggedUser = localStorage.getItem("userData");
      return loggedUser ? JSON.parse(loggedUser) : null;
    } catch {
      return null;
    }
  });

  // ✅ loading state (مهم جدًا)
  const [loading, setLoading] = useState(true);

  // 🔄 استرجاع بعد الريفريش
  useEffect(() => {
    try {
      const loggedUser = localStorage.getItem("userData");
      if (loggedUser) {
        setUser(JSON.parse(loggedUser));
      }
    } catch {
      localStorage.removeItem("userData");
    } finally {
      setLoading(false); // 🔥 يمنع المشكلة
    }
  }, []);

  // 📝 Register
const register = async (user) => {
  try {
    const res = await axiosInstance.get(`/employees?email=${user.email}`);

    if (res.data.length > 0) {
      return { success: false, message: "Email already exists" };
    }

    // ✅ إضافة ID عشوائي
    const newUserData = {
      ...user,
      id: Math.random().toString(16).slice(2)
    };

    const newUser = await axiosInstance.post("/employees", newUserData);

    setUser(newUser.data);
    localStorage.setItem("userData", JSON.stringify(newUser.data));

    return { success: true, user: newUser.data };
  } catch {
    return { success: false, message: "Server error" };
  }
};
  // 🔐 Login
  const login = async (user) => {
    try {
      const res = await axiosInstance.get(
        `/employees?email=${user.email.trim()}&password=${user.password.trim()}`
      );

      if (res.data.length === 0) {
        return { success: false, message: "Invalid email or password" };
      }

      const loggedUser = res.data[0];

      setUser(loggedUser);
      localStorage.setItem("userData", JSON.stringify(loggedUser));

      return { success: true, user: loggedUser };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Server error" };
    }
  };

  // 🚪 Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userData");
  };

  return (
    <AutContext.Provider value={{ User, loading, register, login, logout }}>
      {children}
    </AutContext.Provider>
  );
};

// ✅ Custom Hook (زي ما هو)
export const Auth = () => useContext(AutContext);