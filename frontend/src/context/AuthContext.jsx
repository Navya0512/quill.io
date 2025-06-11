import { useContext, useState, useEffect, createContext } from "react";
let AuthContext = createContext();

export let AuthProvider = ({ children }) => {
  let [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      return parsedUser;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });


  let [token, setToken] = useState(() => localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    try {
      if (user) {
        // Check if user is already a string to prevent double stringifying
        const userString = typeof user === 'string' ? user : JSON.stringify(user);
        localStorage.setItem("user", userString);
      } else {
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error storing user to localStorage:", error);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

let useAuth = () => {
  return useContext(AuthContext);
};
export default useAuth;