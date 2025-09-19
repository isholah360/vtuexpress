// // src/services/api.js
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Add auth token to requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Auth APIs
// export const signup = async (userData) => {
//   const res = await api.post('/auth/signup', userData);
//   return res.data.user; // { token, user }
  
// };

// export const signin = async (userData) => {
//   const res = await api.post('/auth/login', userData);
//   console.log(res.data.user);
  
//   return res.data.user;
  
// };

// // (Keep your existing Paystack, VTPass APIs here too)