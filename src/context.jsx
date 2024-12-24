import {
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";

export const userContext = createContext();

export const CLIENT_BASE_URL = import.meta.env.VITE_APP_ENV === "development" ? "http://localhost:5000/api" : import.meta.env.VITE_APP_PROD_URL

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const persistLogin = useCallback(async () => {
  
    try {
      const { data } = await axios.get(`${CLIENT_BASE_URL}/auth/check`);
      setUser(data);
    } catch (err) {
      console.error(err)
       const pathname = window.location.pathname;

      
      if(err?.response?.data?.message === "token required"){
        if (window.location.pathname === "/profile") {
          window.location.assign("/Sign-in")
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      persistLogin();
    }
  },[user, persistLogin]);

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
}
