import axios from 'axios';
import store from './redux/store/store';
import { refreshToken, logoutAction } from './redux/slice/authSlice';
import { BASE_URL } from './config';

const api = axios.create({
  baseURL: BASE_URL,
});

const refreshAccessToken = async () => {
  const refreshTokenValue = localStorage.getItem('REFRESH_TOKEN');
  const response = await axios.post(`${BASE_URL}/api/auth/token/refresh`, { refresh: refreshTokenValue });
  localStorage.setItem('accessToken', response.data.access);
  localStorage.setItem('refreshToken', response.data.refresh);
  return response.data.accessToken;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log('inside inteceptors');
    if (error.response.status === 401 && !originalRequest._retry) {
        console.log('inside if condition inteceptors');
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        console.log(newToken,'new token value');
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (e) {
        store.dispatch(logoutAction());
      }
    }
    return Promise.reject(error);
  }
);

export default api;
