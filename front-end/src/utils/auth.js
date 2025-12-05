// import api from "./api";

// // Login: get access + refresh tokens
// export const login = async (username, password) => {
//   const res = await api.post("/token/", { username, password });
//   return res.data; 
// };

// // Refresh token
// export const refreshToken = async (refresh) => {
//   const res = await api.post("/token/refresh/", { refresh });
//   return res.data; 
// };

// // Logout (optional: clear tokens client-side)
// export const logout = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("refresh");
// };

import api from "./api";

// Login: get access + refresh tokens
export const login = async (username, password) => {
  try {
    const res = await api.post("/token/", { username, password });
    const { access, refresh } = res.data;

    saveTokens({ access, refresh });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.detail || "Login failed");
  }
};

// Refresh access token using refresh token
export const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token available");

  try {
    const res = await api.post("/token/refresh/", { refresh });
    const { access } = res.data;
    saveTokens({ access });
    return access;
  } catch (err) {
    clearTokens();
    throw new Error("Failed to refresh token");
  }
};

// Logout: clear tokens for this tab
export const logout = () => {
  clearTokens();
};


// Get or create a unique tab ID
export const getTabId = () => {
  let tabId = sessionStorage.getItem("tabId");
  if (!tabId) {
    tabId = Date.now().toString();
    sessionStorage.setItem("tabId", tabId);
  }
  return tabId;
};

// Save tokens for this tab
export const saveTokens = ({ access, refresh }) => {
  const tabId = getTabId();
  if (access) localStorage.setItem(`accessToken-${tabId}`, access);
  if (refresh) localStorage.setItem(`refreshToken-${tabId}`, refresh);
};

// Get access token for this tab
export const getToken = () => {
  const tabId = getTabId();
  return localStorage.getItem(`accessToken-${tabId}`);
};

// Get refresh token for this tab
export const getRefreshToken = () => {
  const tabId = getTabId();
  return localStorage.getItem(`refreshToken-${tabId}`);
};

// Clear tokens for this tab
export const clearTokens = () => {
  const tabId = getTabId();
  localStorage.removeItem(`accessToken-${tabId}`);
  localStorage.removeItem(`refreshToken-${tabId}`);
};


