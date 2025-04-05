import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost/api',
  timeout: 10000,        // 10 secondi max di timeout per eventuali richieste lente
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;