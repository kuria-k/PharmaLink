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

 import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getBranches = () => api.get('/branches/');
export const createBranch = (data) => api.post('/branches/', data);
export const updateBranch = (id, data) => api.put(`/branches/${id}/`, data);
export const deleteBranch = (id) => api.delete(`/branches/${id}/`);


export default api;

