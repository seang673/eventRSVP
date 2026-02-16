import axios from 'axios';

const token = localStorage.getItem('token');

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Request interceptor to attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh');
        const res = await axios.post('/api/token/refresh/', { refresh: refreshToken });
        localStorage.setItem('token', res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest); // retry original request
      } catch (refreshErr) {
        console.error('Token refresh failed:', refreshErr);
        // Optionally redirect to login
      }
    }

    return Promise.reject(err);
  }
);



export default api;