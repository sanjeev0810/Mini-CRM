import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use(req => {
  const token = localStorage.getItem("token");
  if (token) {
    // ✅ Keeping your working logic: No 'Bearer ' prefix
    req.headers.Authorization = token;
  }
  return req;
}, error => {
  return Promise.reject(error);
});

export default API;