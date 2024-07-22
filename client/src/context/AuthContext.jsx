import { createContext, useContext, useEffect, useState } from "react";
import Spinner from "./../../src/components/Spinner"

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (user) => {
    setUserData(user);
    sessionStorage.setItem("userData", JSON.stringify(user));
    setLoading(false); 
  };

  const logout = () => {
    setUserData(null);
    sessionStorage.removeItem("userData");
    setLoading(false);
  };

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <Spinner />; 
  }

  return (
    <AuthContext.Provider value={{ userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};