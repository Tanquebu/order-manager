import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      getUser(); // se presenti recupero i dati dell'utente al ricaricamento del frontend
    }
  }, []);

  const getUser = async () => {
    try {
      const res = await api.get("/user");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const res = await api.post('/login', credentials);
      const token = res.data.access_token;
  
      // salvo il token in localStorage
      // e lo imposto come header di default per le richieste future
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      setUser(res.data.user);
  
      return true;
    } catch (err) {
      console.error("Errore login:", err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.warn("Logout fallito lato server", err);
    }
  
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);