import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const UserContext = createContext(null);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLogInError, setIsLogInError] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");

  const loadSession = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/me`, { credentials: "include" });
      if (response.ok) setUser(await response.json());
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => { loadSession(); }, [loadSession]);

  async function login(email, password) {
    setIsLogInError(false);
    setLoginErrorMsg("");
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setIsLogInError(true);
        setLoginErrorMsg(data.message || "Login failed.");
        return false;
      }
      await loadSession();
      return true;
    } catch (error) {
      setIsLogInError(true);
      setLoginErrorMsg("Cannot connect to the backend. Start Next.js on port 3000.");
      return false;
    }
  }

  async function logout() {
    await fetch(`${apiBaseUrl}/api/auth/logout`, { credentials: "include" });
    setUser(null);
  }

  const value = useMemo(() => ({
    user, login, logout, isLoggedIn: Boolean(user), isInitializing, isLogInError, loginErrorMsg,
  }), [user, isInitializing, isLogInError, loginErrorMsg]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
