import axios from 'axios';

export const emailApi = axios.create({
  baseURL: 'http://localhost:4000/v1/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.EMAIL_ENGINE_TOKEN}`,
  },
});
