import api from "./api";

// Login: get access + refresh tokens
export const login = async (username, password) => {
  const res = await api.post("/token/", { username, password });
  return res.data; 
};

// Refresh token
export const refreshToken = async (refresh) => {
  const res = await api.post("/token/refresh/", { refresh });
  return res.data; 
};

// Logout (optional: clear tokens client-side)
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
};
