import axios from 'axios';

export const emailApi = axios.create({
  baseURL: process.env.EMAIL_ENGINE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.EMAIL_ENGINE_TOKEN}`,
  },
});
