import axios from "axios";

// export const baseURL = 'http://172.105.37.163:9976/api/v1'; //Old API without SSL
export const baseURL = 'http://127.0.0.1:8000/api/';
// export const baseURL = 'http://127.0.0.1:8000/api/v1';
export const token = localStorage.getItem('access_token');

const instance = axios.create({
  // baseURL: "http://172.105.37.163:9976", //Without SSL
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
