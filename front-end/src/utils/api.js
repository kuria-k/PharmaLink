// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api/profiles/',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Branch Endpoints
// export const getBranches = () => api.get('/branches/');
// export const createBranch = (data) => api.post('/branches/', data);

// // UserProfile Endpoints
// export const getUserProfiles = () => api.get('/profiles/');
// export const createUserProfile = (data) => api.post('/profiles/', data);
// export const getUserProfileById = (id) => api.get(`/profiles/${id}/`);
// export const updateUserProfile = (id, data) => api.put(`/profiles/${id}/`, data);
// export const deleteUserProfile = (id) => api.delete(`/profiles/${id}/`);
// export const getUsers = () => api.get('/users/');
// export const getSales = () => api.get('/sales/');
// export const getProducts = () => api.get('/products/');


// export default api;

//  import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },

  
// });

// export const getBranches = () => api.get('/branches/');
// export const createBranch = (data) => api.post('/branches/', data);
// export const updateBranch = (id, data) => api.put(`/branches/${id}/`, data);
// export const deleteBranch = (id) => api.delete(`/branches/${id}/`);


// export default api;


// import axios from 'axios';

// // Create axios instance
// const api = axios.create({
//   baseURL: 'http://localhost:8000/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor: attach token if available
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor: handle errors globally
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn('Unauthorized! Token may be expired.');
//     }
//     return Promise.reject(error);
//   }
// );

// // Branch endpoints
// export const getBranches = () => api.get('/branches/');
// export const createBranch = (data) => api.post('/branches/', data);
// export const updateBranch = (id, data) => api.put(`/branches/${id}/`, data);
// export const deleteBranch = (id) => api.delete(`/branches/${id}/`);

// // Auth endpoints 
// export const login = (username, password) =>
//   api.post('/token/', { username, password });
// export const refreshToken = (refresh) =>
//   api.post('/token/refresh/', { refresh });

// export default api;

// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api', 
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor: attach token if available
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // // Response interceptor: handle 401 errors and auto-refresh
// // api.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     const originalRequest = error.config;

// //     if (error.response?.status === 401 && !originalRequest._retry) {
// //       originalRequest._retry = true;

// //       try {
// //         const refresh = localStorage.getItem('refresh');
// //         if (refresh) {
// //           // Refresh the token
// //           const res = await axios.post('http://localhost:8000/api/token/refresh/', { refresh });
// //           const newAccess = res.data.access;

// //           // Save new token
// //           localStorage.setItem('token', newAccess);

// //           // Update headers
// //           api.defaults.headers.Authorization = `Bearer ${newAccess}`;
// //           originalRequest.headers.Authorization = `Bearer ${newAccess}`;

// //           // Retry the original request
// //           return api(originalRequest);
// //         }
// //       } catch (refreshError) {
// //         console.error('Refresh token failed', refreshError);
// //         localStorage.removeItem('token');
// //         localStorage.removeItem('refresh');
// //         window.location.href = '/login';
// //       }
// //     }

// //     return Promise.reject(error);
// //   }
// // );

// //
// // Branch endpoints
// //
// export const getBranches = () => api.get('/branches/');
// export const createBranch = (data) => api.post('/branches/', data);
// export const updateBranch = (id, data) => api.put(`/branches/${id}/`, data);
// export const deleteBranch = (id) => api.delete(`/branches/${id}/`);

// //
// // User endpoints
// export const getUsers = () => api.get('/users/');

// //
// // Profile endpoints
// export const getProfiles = () => api.get('/profiles/');
// export const createProfile = (data) => api.post('/profiles/', data);
// export const updateProfile = (id, data) => api.put(`/profiles/${id}/`, data);
// export const deleteProfile = (id) => api.delete(`/profiles/${id}/`);

// // Product (Inventory) endpoints
// export const getProducts = () => api.get('/inventory/products/');
// export const createInventory = (data) => api.post('/inventory/products/', data);
// export const updateProduct = (id, data) => api.put(`/inventory/products/${id}/`, data);
// export const deleteProduct = (id) => api.delete(`/inventory/products/${id}/`);



// //
// // Auth endpoints
// // export const login = async (username, password) => {
// //   const res = await api.post('/token/', { username, password });
// //   const { access, refresh } = res.data;

// //   localStorage.setItem('token', access);
// //   localStorage.setItem('refresh', refresh);

// //   return res.data;
// // };

// // export const refreshToken = async (refresh) => {
// //   const res = await api.post('/token/refresh/', { refresh });
// //   localStorage.setItem('token', res.data.access);
// //   return res.data;
// // };

// // export const logout = () => {
// //   localStorage.removeItem('token');
// //   localStorage.removeItem('refresh');
// // };

// export default api;


import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Branch endpoints
export const getBranches = () => api.get('/branches/');
export const createBranch = (data) => api.post('/branches/', data);
export const updateBranch = (id, data) => api.put(`/branches/${id}/`, data);
export const deleteBranch = (id) => api.delete(`/branches/${id}/`);

// User endpoints
export const getUsers = () => api.get('/users/');

// Profile endpoints
export const getProfiles = () => api.get('/profiles/');
export const createProfile = (data) => api.post('/profiles/', data);
export const updateProfile = (id, data) => api.put(`/profiles/${id}/`, data);
export const deleteProfile = (id) => api.delete(`/profiles/${id}/`);

// Product (Inventory) endpoints
export const getProducts = () => api.get('/inventory/products/');
export const createInventory = (data) => api.post('/inventory/products/', data);
export const updateProduct = (id, data) => api.put(`/inventory/products/${id}/`, data);
export const deleteProduct = (id) => api.delete(`/inventory/products/${id}/`);
export const getInventorySummary = () => api.get('/inventory/summary/');

// Batch endpoints
export const getBatches = () => api.get('/inventory/batches/');
export const createBatch = (data) => api.post('/inventory/batches/', data);
export const updateBatch = (id, data) => api.put(`/inventory/batches/${id}/`, data);
export const deleteBatch = (id) => api.delete(`/inventory/batches/${id}/`);

// Purchase order endpoints
export const getPurchaseOrders = () => api.get('/inventory/purchase-orders/');
export const createPurchaseOrder = (data) => api.post('/inventory/purchase-orders/', data);
export const updatePurchaseOrder = (id, data) => api.put(`/inventory/purchase-orders/${id}/`, data);
export const deletePurchaseOrder = (id) => api.delete(`/inventory/purchase-orders/${id}/`);

// Clients endpoints
export const getCustomers = () => api.get('/sales/customers/');
export const createCustomer = (data) => api.post('/sales/customers/', data);
export const updateCustomer = (id, data) => api.put(`/sales/customers/${id}/`, data);
export const deleteCustomer = (id) => api.delete(`/sales/customers/${id}/`);


// Sales endpoints
export const getSales = () => api.get('/sales/');
export const createSale = (data) => api.post('/sales/', data);
export const updateSale = (id, data) => api.put(`/sales/${id}/`, data);
export const deleteSale = (id) => api.delete(`/sales/${id}/`);
export const getSaleInvoice = (id) => api.get(`/sales/${id}/invoice/`);

export default api;

