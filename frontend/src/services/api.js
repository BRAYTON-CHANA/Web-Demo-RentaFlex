import axios from 'axios';

const api = axios.create({
  baseURL: 'https://web-demo-rentaflex-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response.data);
    return response;
  },
  error => {
    const { status, statusText, data, headers } = error.response || {};
    const { url, method, headers: reqHeaders, data: reqBody, params } = error.config || {};
    
    console.error('API Error:', {
      // Respuesta
      status,
      statusText,
      data,
      headers,
      
      // Petición que falló
      url,
      method,
      params,
      reqHeaders,
      reqBody,
      
      // Info interna de Axios
      code: error.code,
      isAxiosError: error.isAxiosError,
      
      // Detalles del error JS
      message: error.message,
      stack: error.stack,
    });
    
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 
