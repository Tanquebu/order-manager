import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;